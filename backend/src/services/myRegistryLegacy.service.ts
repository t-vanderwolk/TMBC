import fetch from 'node-fetch';
import { Prisma, RegistryStatus } from '@prisma/client';

import { prisma } from '../utils/prisma';
import { buildAffiliateUrl } from './affiliate.service';
import { ConflictRecordInput, recordConflicts, clearConflict, listActiveConflicts } from './conflict.service';

export type MyRegistryResponse<T = unknown> = {
  success: boolean;
  operation: string;
  data?: T;
  message?: string;
  mock?: boolean;
};

const getConfig = () => {
  if (!process.env.MYREGISTRY_API_BASE || !process.env.MYREGISTRY_PARTNER_KEY) {
    return null;
  }

  return {
    baseUrl: process.env.MYREGISTRY_API_BASE,
    partnerKey: process.env.MYREGISTRY_PARTNER_KEY,
    partnerSecret: process.env.MYREGISTRY_PARTNER_SECRET,
  };
};

const buildUrl = (operation: string) => {
  const config = getConfig();
  if (!config) return null;

  const normalizedBase = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
  return `${normalizedBase}/${operation}`;
};

const asQueryString = (payload: Record<string, any>) => {
  const entries = Object.entries(payload).filter(([, value]) => value !== undefined && value !== null);
  if (!entries.length) return '';

  const query = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return query ? `?${query}` : '';
};

const mockResponse = <T>(operation: string, payload: unknown): MyRegistryResponse<T> => ({
  success: true,
  operation,
  mock: true,
  data: {
    referenceId: `mock-${operation}-${Date.now()}`,
    payload,
  } as unknown as T,
  message: 'MyRegistry API not configured. Returning simulated response.',
});

const sendRequest = async <T>(
  operation: string,
  payload: Record<string, any> = {},
  method: 'GET' | 'POST' = 'POST',
): Promise<MyRegistryResponse<T>> => {
  const config = getConfig();

  if (!config) {
    return mockResponse<T>(operation, payload);
  }

  const url = buildUrl(operation);
  if (!url) {
    return mockResponse<T>(operation, payload);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-partner-key': config.partnerKey,
  };

  if (config.partnerSecret) {
    headers['x-partner-secret'] = config.partnerSecret;
  }

  let requestUrl = url;
  let body: string | undefined;

  if (method === 'GET') {
    requestUrl += asQueryString(payload);
  } else {
    body = JSON.stringify(payload);
  }

  const response = await fetch(requestUrl, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MyRegistry ${operation} failed: ${text || response.statusText}`);
  }

  const data = (await response.json()) as T;

  return {
    success: true,
    operation,
    data,
  };
};

export const isMyRegistryConfigured = () => Boolean(getConfig());

export type SignupUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  partnerUserId?: string;
};

export type AddGiftPayload = {
  memberExternalId: string;
  productName: string;
  affiliateUrl: string;
  merchant: string;
  quantity: number;
  price?: number | null;
  notes?: string | null;
};

export type UpdateGiftPayload = {
  giftId: string;
  quantity?: number;
  notes?: string | null;
  affiliateUrl?: string;
  status?: string;
};

export type RemoveGiftPayload = {
  giftId: string;
};

export type GetGiftsPayload = {
  memberExternalId: string;
};

export const createMyRegistryUser = (payload: SignupUserPayload) => sendRequest('SignupUser', payload);
export const addGiftToMyRegistry = (payload: AddGiftPayload) => sendRequest('AddGift', payload);
export const updateMyRegistryGift = (payload: UpdateGiftPayload) => sendRequest('UpdateGift', payload);
export const removeMyRegistryGift = (payload: RemoveGiftPayload) => sendRequest('RemoveGift', payload);
export const listMyRegistryGifts = (payload: GetGiftsPayload) => sendRequest('GetGifts2', payload);
export const listMyRegistryAccounts = (payload: { email: string }) => sendRequest('GetRegistries2', payload);

const SYNC_BASE_URL = process.env.MYREGISTRY_SYNC_BASE_URL || 'https://api.myregistry.com/RegistryApi/1/0/json';
const DEFAULT_OAUTH_URL = process.env.MYREGISTRY_OAUTH_URL || 'https://api.myregistry.com/oauth/token';
const TOKEN_BUFFER_MS = 60_000;

type OAuthTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: string;
};

type UserTokenState = {
  myRegistryAccessToken: string | null;
  myRegistryRefreshToken: string | null;
  myRegistryTokenExpires: Date | null;
  myRegistryLastSyncedAt: Date | null;
};

type RegistryItemWithProduct = Prisma.RegistryItemGetPayload<{
  include: { product: true };
}>;

type SyncSuccessResult = {
  ok: true;
  items: RegistryItemWithProduct[];
  conflicts: Awaited<ReturnType<typeof listActiveConflicts>>;
  lastSync: Date;
};

type SyncFailureResult = {
  ok: false;
  error: string;
  needsAuth?: boolean;
};

type SyncResult = SyncSuccessResult | SyncFailureResult;

type TokenResult =
  | { ok: true; token: string; state: UserTokenState | null }
  | { ok: false; error: string; needsAuth?: boolean };

const getOAuthConfig = () => {
  const clientId = process.env.MYREGISTRY_PARTNER_KEY;
  const clientSecret = process.env.MYREGISTRY_PARTNER_SECRET;
  const redirectUri = process.env.MYREGISTRY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    tokenUrl: DEFAULT_OAUTH_URL,
  };
};

const getUserTokenState = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      myRegistryAccessToken: true,
      myRegistryRefreshToken: true,
      myRegistryTokenExpires: true,
      myRegistryLastSyncedAt: true,
    },
  });
};

const tokenNeedsRefresh = (expiresAt?: Date | null) => {
  if (!expiresAt) return true;
  return expiresAt.getTime() - TOKEN_BUFFER_MS <= Date.now();
};

const persistTokens = async (userId: string, payload: OAuthTokenResponse) => {
  const expiresInMs = typeof payload.expires_in === 'number' ? payload.expires_in * 1000 : null;
  const expiresAt = payload.expires_at ? new Date(payload.expires_at) : expiresInMs ? new Date(Date.now() + expiresInMs) : null;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      myRegistryAccessToken: payload.access_token,
      myRegistryRefreshToken: payload.refresh_token ?? null,
      myRegistryTokenExpires: expiresAt,
    },
    select: {
      myRegistryAccessToken: true,
      myRegistryRefreshToken: true,
      myRegistryTokenExpires: true,
      myRegistryLastSyncedAt: true,
    },
  });

  return updated;
};

const ensureAccessToken = async (userId: string, stateOverride?: UserTokenState | null): Promise<TokenResult> => {
  const state = stateOverride ?? (await getUserTokenState(userId));
  if (!state || !state.myRegistryAccessToken) {
    return { ok: false, error: 'MyRegistry is not connected for this user.', needsAuth: true };
  }

  if (!tokenNeedsRefresh(state.myRegistryTokenExpires)) {
    return { ok: true, token: state.myRegistryAccessToken, state };
  }

  if (!state.myRegistryRefreshToken) {
    return { ok: false, error: 'MyRegistry authorization expired.', needsAuth: true };
  }

  const refreshed = await refreshToken(userId);
  if (!refreshed.ok) {
    return { ok: false, error: refreshed.error, needsAuth: refreshed.needsAuth };
  }

  const nextState = await getUserTokenState(userId);
  if (!nextState?.myRegistryAccessToken) {
    return { ok: false, error: 'Unable to refresh MyRegistry token.', needsAuth: true };
  }

  return { ok: true, token: nextState.myRegistryAccessToken, state: nextState };
};

type SyncApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

const callSyncApi = async <T>(
  operation: string,
  token: string,
  payload: Record<string, any> = {},
  method: 'GET' | 'POST' = 'POST',
): Promise<SyncApiResult<T>> => {
  const normalizedBase = SYNC_BASE_URL.endsWith('/') ? SYNC_BASE_URL.slice(0, -1) : SYNC_BASE_URL;
  let requestUrl = `${normalizedBase}/${operation}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  let body: string | undefined;
  if (method === 'GET') {
    requestUrl += asQueryString(payload);
  } else {
    body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(requestUrl, { method, headers, body });
    if (response.status === 401) {
      return { ok: false, status: 401, error: 'Unauthorized' };
    }

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, status: response.status, error: text || 'MyRegistry sync request failed' };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, status: 500, error: error?.message || 'Unable to reach MyRegistry' };
  }
};

type RemoteRegistryItem = {
  id: string;
  title: string;
  quantity?: number | null;
  status?: string | null;
  notes?: string | null;
  affiliateUrl?: string | null;
  merchant?: string | null;
  image?: string | null;
  price?: number | null;
  lastUpdated?: Date | null;
  removed?: boolean;
};

const parseRemoteTimestamp = (item: Record<string, any>) => {
  const candidates = [
    item.updatedAt,
    item.UpdatedAt,
    item.lastUpdated,
    item.LastUpdated,
    item.modifiedAt,
    item.ModifiedAt,
    item.modifiedUTC,
    item.ModifiedUTC,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const normalizeRemoteItem = (item: Record<string, any>): RemoteRegistryItem | null => {
  const id = item.giftId || item.GiftId || item.remoteGiftId;
  if (!id) return null;

  const quantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 1;
  const price = typeof item.price === 'number' ? item.price : Number(item.price) || null;

  return {
    id: String(id),
    title: item.productName || item.ProductName || item.title || 'MyRegistry Item',
    quantity,
    status: item.status || item.Status || null,
    notes: item.customNote ?? item.CustomNote ?? item.notes ?? null,
    affiliateUrl: item.affiliateUrl || item.AffiliateUrl || item.url || null,
    merchant: item.merchant || item.Merchant || null,
    image: item.imageUrl || item.ImageUrl || null,
    price,
    lastUpdated: parseRemoteTimestamp(item),
    removed: Boolean(item.isDeleted || item.deleted || item.Removed),
  };
};

const normalizeRemoteItems = (payload: any): RemoteRegistryItem[] => {
  const items = payload?.items || payload?.Items || payload?.data || [];
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => normalizeRemoteItem(item))
    .filter((item): item is RemoteRegistryItem => Boolean(item?.id));
};

const toRegistryStatus = (value?: string | null) => {
  if (!value) return RegistryStatus.ACTIVE;
  const normalized = value.toUpperCase();
  const statuses = Object.values(RegistryStatus);
  if (statuses.includes(normalized as RegistryStatus)) {
    return normalized as RegistryStatus;
  }

  if (normalized.includes('PURCHASED')) return RegistryStatus.PURCHASED;
  if (normalized.includes('RESERVE')) return RegistryStatus.RESERVED;
  if (normalized.includes('NEED')) return RegistryStatus.NEEDED;

  return RegistryStatus.ACTIVE;
};

const valueToString = (value: unknown) => {
  if (value === undefined || value === null) return null;
  return String(value);
};

type TokenExchangeResult =
  | { ok: true; accessToken: string }
  | { ok: false; error: string; needsAuth?: boolean };

type TokenApiResponse =
  | { ok: true; payload: OAuthTokenResponse }
  | { ok: false; error: string; needsAuth?: boolean };

const exchangeToken = async (body: Record<string, string>): Promise<TokenApiResponse> => {
  const config = getOAuthConfig();
  if (!config) {
    return { ok: false, error: 'MyRegistry OAuth is not configured.', needsAuth: true };
  }

  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        ...body,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
      }).toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text || 'MyRegistry token exchange failed', needsAuth: response.status === 400 };
    }

    const payload = (await response.json()) as OAuthTokenResponse;
    return { ok: true, payload };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Unable to reach MyRegistry token endpoint' };
  }
};

export const exchangeAuthCodeForToken = async (userId: string, authCode: string) => {
  const result = await exchangeToken({
    grant_type: 'authorization_code',
    code: authCode,
  });

  if (!result.ok) {
    return { ok: false, error: result.error || 'Unable to connect to MyRegistry', needsAuth: result.needsAuth };
  }

  const state = await persistTokens(userId, result.payload);
  return state.myRegistryAccessToken
    ? { ok: true, accessToken: state.myRegistryAccessToken }
    : { ok: false, error: 'Unable to store MyRegistry token', needsAuth: true };
};

export const refreshToken = async (userId: string): Promise<TokenExchangeResult> => {
  const existing = await getUserTokenState(userId);
  if (!existing?.myRegistryRefreshToken) {
    return { ok: false, error: 'Missing MyRegistry refresh token', needsAuth: true };
  }

  const result = await exchangeToken({
    grant_type: 'refresh_token',
    refresh_token: existing.myRegistryRefreshToken,
  });

  if (!result.ok) {
    return { ok: false, error: result.error || 'Unable to refresh MyRegistry token', needsAuth: result.needsAuth };
  }

  const state = await persistTokens(userId, result.payload);
  return state.myRegistryAccessToken
    ? { ok: true, accessToken: state.myRegistryAccessToken }
    : { ok: false, error: 'Unable to refresh MyRegistry token', needsAuth: true };
};

type AddGiftInput = {
  userId: string;
  title: string;
  url: string;
  price?: number | null;
  image?: string | null;
};

const pullAffiliateUrl = (item: RegistryItemWithProduct) => {
  if (item.product) {
    return buildAffiliateUrl({ url: item.product.affiliateUrl, merchant: item.product.merchant });
  }

  return buildAffiliateUrl({ url: item.url, merchant: item.merchant });
};

const buildRemotePayload = (item: RegistryItemWithProduct, userId: string) => ({
  memberExternalId: userId,
  giftId: item.myRegistryId,
  productName: item.title,
  affiliateUrl: pullAffiliateUrl(item),
  merchant: item.product?.merchant || item.merchant || 'MyRegistry',
  quantity: item.quantity,
  notes: item.notes,
  status: item.status,
  price: item.product?.price ?? item.price ?? null,
});

const shouldNumbersDiffer = (a?: number | null, b?: number | null) => {
  return Number(a ?? 0) !== Number(b ?? 0);
};

const compareStrings = (a?: string | null, b?: string | null) => {
  return (a ?? '') !== (b ?? '');
};

const syncWithRetry = async <T>(
  userId: string,
  operation: string,
  tokenRef: { current: string },
  payload: Record<string, any>,
  method: 'GET' | 'POST' = 'POST',
): Promise<SyncApiResult<T>> => {
  let response = await callSyncApi<T>(operation, tokenRef.current, payload, method);
  if (response.ok || response.status !== 401) {
    return response;
  }

  const refreshed = await refreshToken(userId);
  if (!refreshed.ok) {
    return response;
  }

  tokenRef.current = refreshed.accessToken;
  return callSyncApi<T>(operation, tokenRef.current, payload, method);
};

export const syncDown = async (userId: string): Promise<SyncResult> => {
  try {
    const state = await getUserTokenState(userId);
    const tokenResult = await ensureAccessToken(userId, state);
    if (!tokenResult.ok) {
      return { ok: false, error: tokenResult.error, needsAuth: tokenResult.needsAuth };
    }

    const tokenRef = { current: tokenResult.token };
    let remoteResponse = await callSyncApi<any>('GetItems', tokenRef.current, { memberExternalId: userId }, 'GET');
    if (!remoteResponse.ok && remoteResponse.status === 401) {
      const refreshed = await refreshToken(userId);
      if (!refreshed.ok) {
        return { ok: false, error: refreshed.error, needsAuth: true };
      }
      tokenRef.current = refreshed.accessToken;
      remoteResponse = await callSyncApi<any>('GetItems', tokenRef.current, { memberExternalId: userId }, 'GET');
    }

    if (!remoteResponse.ok) {
      return { ok: false, error: remoteResponse.error || 'Unable to load MyRegistry items.' };
    }

    const remoteItems = normalizeRemoteItems(remoteResponse.data);
    const localItems = await prisma.registryItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const localByRemote = new Map(localItems.filter((item) => item.myRegistryId).map((item) => [item.myRegistryId!, item]));
    const conflicts: ConflictRecordInput[] = [];
    const remoteIds = new Set(remoteItems.map((item) => item.id));
    const lastSyncAt = tokenResult.state?.myRegistryLastSyncedAt ?? null;
    const now = new Date();

    for (const remote of remoteItems) {
      const existing = localByRemote.get(remote.id);
      if (existing) {
        const remoteStatus = toRegistryStatus(remote.status);
        const remoteQuantity = remote.quantity ?? existing.quantity;
        const remoteNotes = remote.notes ?? null;
        const remoteAffiliate = remote.affiliateUrl ?? existing.url;
        const remoteTimestamp = remote.lastUpdated ?? now;
        const localChanged = lastSyncAt ? existing.updatedAt > lastSyncAt : false;
        const remoteChanged = lastSyncAt ? remoteTimestamp > lastSyncAt : true;
        const updates: Prisma.RegistryItemUpdateInput = {};

        type ComparisonConfig = {
          field: ConflictRecordInput['field'];
          differs: boolean;
          remoteValue: any;
          apply: () => void;
        };

        const comparisons: ComparisonConfig[] = [
          {
            field: 'quantity',
            differs: shouldNumbersDiffer(existing.quantity, remoteQuantity),
            remoteValue: remoteQuantity,
            apply: () => {
              updates.quantity = Number(remoteQuantity);
            },
          },
          {
            field: 'status',
            differs: existing.status !== remoteStatus,
            remoteValue: remoteStatus,
            apply: () => {
              updates.status = remoteStatus;
            },
          },
          {
            field: 'customNote',
            differs: compareStrings(existing.notes, remoteNotes),
            remoteValue: remoteNotes ?? null,
            apply: () => {
              updates.notes = remoteNotes ?? null;
            },
          },
          {
            field: 'affiliateUrl',
            differs: compareStrings(existing.url, remoteAffiliate),
            remoteValue: remoteAffiliate ?? '',
            apply: () => {
              updates.url = remoteAffiliate ?? '';
            },
          },
        ];

        for (const comparison of comparisons) {
          if (!comparison.differs) {
            await clearConflict({ userId, itemId: existing.id, field: comparison.field });
            continue;
          }

          if (localChanged && remoteChanged) {
            conflicts.push({
              userId,
              itemId: existing.id,
              field: comparison.field,
              localValue: valueToString(
                comparison.field === 'quantity'
                  ? existing.quantity
                  : comparison.field === 'status'
                  ? existing.status
                  : comparison.field === 'customNote'
                  ? existing.notes
                  : existing.url,
              ),
              remoteValue: valueToString(comparison.remoteValue),
            });
            continue;
          }

          if (remoteChanged || !localChanged) {
            comparison.apply();
            await clearConflict({ userId, itemId: existing.id, field: comparison.field });
          }
        }

        if (Object.keys(updates).length) {
          await prisma.registryItem.update({
            where: { id: existing.id },
            data: updates,
          });
        }
      } else {
        await prisma.registryItem.create({
          data: {
            userId,
            myRegistryId: remote.id,
            isCustom: true,
            title: remote.title,
            url: remote.affiliateUrl || `https://www.myregistry.com/gift/${remote.id}`,
            merchant: remote.merchant ?? 'MyRegistry',
            image: remote.image,
            price: remote.price,
            quantity: remote.quantity ?? 1,
            notes: remote.notes ?? null,
            status: toRegistryStatus(remote.status),
          },
        });
      }
    }

    const orphaned = localItems
      .filter((item) => item.myRegistryId && !remoteIds.has(item.myRegistryId))
      .map((item) => item.id);

    if (orphaned.length) {
      await prisma.registryItem.updateMany({
        where: { id: { in: orphaned } },
        data: { status: RegistryStatus.REMOVED_REMOTE },
      });
    }

    if (conflicts.length) {
      await recordConflicts(conflicts);
    }

    const lastSync = new Date();
    await prisma.user.update({
      where: { id: userId },
      data: { myRegistryLastSyncedAt: lastSync },
    });

    const refreshedItems = await prisma.registryItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
    const activeConflicts = await listActiveConflicts(userId);

    return { ok: true, items: refreshedItems, conflicts: activeConflicts, lastSync };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Unable to sync with MyRegistry.' };
  }
};

export const syncUp = async (userId: string): Promise<SyncResult> => {
  try {
    const state = await getUserTokenState(userId);
    const tokenResult = await ensureAccessToken(userId, state);
    if (!tokenResult.ok) {
      return { ok: false, error: tokenResult.error, needsAuth: tokenResult.needsAuth };
    }

    const tokenRef = { current: tokenResult.token };
    const items = await prisma.registryItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const creations = items.filter((item) => !item.myRegistryId);
    const updates = items.filter((item) => item.myRegistryId && item.status !== RegistryStatus.REMOVED_REMOTE);
    const removals = items.filter((item) => item.myRegistryId && item.status === RegistryStatus.REMOVED_REMOTE);

    for (const item of creations) {
      const payload = {
        ...buildRemotePayload(item, userId),
        memberExternalId: userId,
      };
      const response = await syncWithRetry<any>(userId, 'AddGift', tokenRef, payload);
      if (!response.ok) continue;

      const giftId = response.data?.giftId || response.data?.GiftId || response.data?.id;
      if (giftId) {
        await prisma.registryItem.update({
          where: { id: item.id },
          data: { myRegistryId: String(giftId) },
        });
      }
    }

    for (const item of updates) {
      if (!item.myRegistryId) continue;
      const payload = {
        ...buildRemotePayload(item, userId),
        giftId: item.myRegistryId,
      };
      await syncWithRetry(userId, 'UpdateGift', tokenRef, payload);
    }

    for (const item of removals) {
      if (!item.myRegistryId) continue;
      await syncWithRetry(userId, 'RemoveGift', tokenRef, { giftId: item.myRegistryId });
    }

    const lastSync = new Date();
    await prisma.user.update({
      where: { id: userId },
      data: { myRegistryLastSyncedAt: lastSync },
    });

    const refreshedItems = await prisma.registryItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
    const activeConflicts = await listActiveConflicts(userId);

    return { ok: true, items: refreshedItems, conflicts: activeConflicts, lastSync };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Unable to push updates to MyRegistry.' };
  }
};

export const isConnected = async (userId: string) => {
  if (!isMyRegistryConfigured()) return false;

  const state = await getUserTokenState(userId);
  if (state?.myRegistryAccessToken) {
    return true;
  }

  const existing = await prisma.registryItem.findFirst({
    where: { userId, myRegistryId: { not: null } },
    select: { id: true },
  });

  return Boolean(existing);
};

export const addGift = async ({ userId, title, url, price, image }: AddGiftInput) => {
  const response = await addGiftToMyRegistry({
    memberExternalId: userId,
    productName: title,
    affiliateUrl: url,
    merchant: 'Custom',
    quantity: 1,
    price: price ?? null,
    notes: image ?? undefined,
  });

  const giftId = (response.data as any)?.giftId;
  return typeof giftId === 'string' ? giftId : null;
};

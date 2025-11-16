import fetch from 'node-fetch';

import { prisma } from '../utils/prisma';

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

type AddGiftInput = {
  userId: string;
  title: string;
  url: string;
  price?: number | null;
  image?: string | null;
};

export const isConnected = async (userId: string) => {
  if (!isMyRegistryConfigured()) return false;

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

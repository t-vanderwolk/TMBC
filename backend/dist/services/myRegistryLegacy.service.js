"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGift = exports.isConnected = exports.syncUp = exports.syncDown = exports.refreshToken = exports.exchangeAuthCodeForToken = exports.listMyRegistryAccounts = exports.listMyRegistryGifts = exports.removeMyRegistryGift = exports.updateMyRegistryGift = exports.addGiftToMyRegistry = exports.createMyRegistryUser = exports.isMyRegistryConfigured = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const affiliate_service_1 = require("./affiliate.service");
const conflict_service_1 = require("./conflict.service");
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
const buildUrl = (operation) => {
    const config = getConfig();
    if (!config)
        return null;
    const normalizedBase = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
    return `${normalizedBase}/${operation}`;
};
const asQueryString = (payload) => {
    const entries = Object.entries(payload).filter(([, value]) => value !== undefined && value !== null);
    if (!entries.length)
        return '';
    const query = entries
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
    return query ? `?${query}` : '';
};
const mockResponse = (operation, payload) => ({
    success: true,
    operation,
    mock: true,
    data: {
        referenceId: `mock-${operation}-${Date.now()}`,
        payload,
    },
    message: 'MyRegistry API not configured. Returning simulated response.',
});
const sendRequest = async (operation, payload = {}, method = 'POST') => {
    const config = getConfig();
    if (!config) {
        return mockResponse(operation, payload);
    }
    const url = buildUrl(operation);
    if (!url) {
        return mockResponse(operation, payload);
    }
    const headers = {
        'Content-Type': 'application/json',
        'x-partner-key': config.partnerKey,
    };
    if (config.partnerSecret) {
        headers['x-partner-secret'] = config.partnerSecret;
    }
    let requestUrl = url;
    let body;
    if (method === 'GET') {
        requestUrl += asQueryString(payload);
    }
    else {
        body = JSON.stringify(payload);
    }
    const response = await (0, node_fetch_1.default)(requestUrl, {
        method,
        headers,
        body,
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`MyRegistry ${operation} failed: ${text || response.statusText}`);
    }
    const data = (await response.json());
    return {
        success: true,
        operation,
        data,
    };
};
const isMyRegistryConfigured = () => Boolean(getConfig());
exports.isMyRegistryConfigured = isMyRegistryConfigured;
const createMyRegistryUser = (payload) => sendRequest('SignupUser', payload);
exports.createMyRegistryUser = createMyRegistryUser;
const addGiftToMyRegistry = (payload) => sendRequest('AddGift', payload);
exports.addGiftToMyRegistry = addGiftToMyRegistry;
const updateMyRegistryGift = (payload) => sendRequest('UpdateGift', payload);
exports.updateMyRegistryGift = updateMyRegistryGift;
const removeMyRegistryGift = (payload) => sendRequest('RemoveGift', payload);
exports.removeMyRegistryGift = removeMyRegistryGift;
const listMyRegistryGifts = (payload) => sendRequest('GetGifts2', payload);
exports.listMyRegistryGifts = listMyRegistryGifts;
const listMyRegistryAccounts = (payload) => sendRequest('GetRegistries2', payload);
exports.listMyRegistryAccounts = listMyRegistryAccounts;
const SYNC_BASE_URL = process.env.MYREGISTRY_SYNC_BASE_URL || 'https://api.myregistry.com/RegistryApi/1/0/json';
const DEFAULT_OAUTH_URL = process.env.MYREGISTRY_OAUTH_URL || 'https://api.myregistry.com/oauth/token';
const TOKEN_BUFFER_MS = 60_000;
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
const getUserTokenState = async (userId) => {
    return prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            myRegistryAccessToken: true,
            myRegistryRefreshToken: true,
            myRegistryTokenExpires: true,
            myRegistryLastSyncedAt: true,
        },
    });
};
const tokenNeedsRefresh = (expiresAt) => {
    if (!expiresAt)
        return true;
    return expiresAt.getTime() - TOKEN_BUFFER_MS <= Date.now();
};
const persistTokens = async (userId, payload) => {
    const expiresInMs = typeof payload.expires_in === 'number' ? payload.expires_in * 1000 : null;
    const expiresAt = payload.expires_at ? new Date(payload.expires_at) : expiresInMs ? new Date(Date.now() + expiresInMs) : null;
    const updated = await prisma_1.prisma.user.update({
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
const ensureAccessToken = async (userId, stateOverride) => {
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
    const refreshed = await (0, exports.refreshToken)(userId);
    if (!refreshed.ok) {
        return { ok: false, error: refreshed.error, needsAuth: refreshed.needsAuth };
    }
    const nextState = await getUserTokenState(userId);
    if (!nextState?.myRegistryAccessToken) {
        return { ok: false, error: 'Unable to refresh MyRegistry token.', needsAuth: true };
    }
    return { ok: true, token: nextState.myRegistryAccessToken, state: nextState };
};
const callSyncApi = async (operation, token, payload = {}, method = 'POST') => {
    const normalizedBase = SYNC_BASE_URL.endsWith('/') ? SYNC_BASE_URL.slice(0, -1) : SYNC_BASE_URL;
    let requestUrl = `${normalizedBase}/${operation}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    let body;
    if (method === 'GET') {
        requestUrl += asQueryString(payload);
    }
    else {
        body = JSON.stringify(payload);
    }
    try {
        const response = await (0, node_fetch_1.default)(requestUrl, { method, headers, body });
        if (response.status === 401) {
            return { ok: false, status: 401, error: 'Unauthorized' };
        }
        if (!response.ok) {
            const text = await response.text();
            return { ok: false, status: response.status, error: text || 'MyRegistry sync request failed' };
        }
        const data = (await response.json());
        return { ok: true, data };
    }
    catch (error) {
        return { ok: false, status: 500, error: error?.message || 'Unable to reach MyRegistry' };
    }
};
const parseRemoteTimestamp = (item) => {
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
        if (!candidate)
            continue;
        const parsed = new Date(candidate);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed;
        }
    }
    return null;
};
const normalizeRemoteItem = (item) => {
    const id = item.giftId || item.GiftId || item.remoteGiftId;
    if (!id)
        return null;
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
const normalizeRemoteItems = (payload) => {
    const items = payload?.items || payload?.Items || payload?.data || [];
    if (!Array.isArray(items)) {
        return [];
    }
    return items
        .map((item) => normalizeRemoteItem(item))
        .filter((item) => Boolean(item?.id));
};
const toRegistryStatus = (value) => {
    if (!value)
        return client_1.RegistryStatus.ACTIVE;
    const normalized = value.toUpperCase();
    const statuses = Object.values(client_1.RegistryStatus);
    if (statuses.includes(normalized)) {
        return normalized;
    }
    if (normalized.includes('PURCHASED'))
        return client_1.RegistryStatus.PURCHASED;
    if (normalized.includes('RESERVE'))
        return client_1.RegistryStatus.RESERVED;
    if (normalized.includes('NEED'))
        return client_1.RegistryStatus.NEEDED;
    return client_1.RegistryStatus.ACTIVE;
};
const valueToString = (value) => {
    if (value === undefined || value === null)
        return null;
    return String(value);
};
const exchangeToken = async (body) => {
    const config = getOAuthConfig();
    if (!config) {
        return { ok: false, error: 'MyRegistry OAuth is not configured.', needsAuth: true };
    }
    try {
        const response = await (0, node_fetch_1.default)(config.tokenUrl, {
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
        const payload = (await response.json());
        return { ok: true, payload };
    }
    catch (error) {
        return { ok: false, error: error?.message || 'Unable to reach MyRegistry token endpoint' };
    }
};
const exchangeAuthCodeForToken = async (userId, authCode) => {
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
exports.exchangeAuthCodeForToken = exchangeAuthCodeForToken;
const refreshToken = async (userId) => {
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
exports.refreshToken = refreshToken;
const pullAffiliateUrl = (item) => {
    if (item.product) {
        return (0, affiliate_service_1.buildAffiliateUrl)({ url: item.product.affiliateUrl, merchant: item.product.merchant });
    }
    return (0, affiliate_service_1.buildAffiliateUrl)({ url: item.url, merchant: item.merchant });
};
const buildRemotePayload = (item, userId) => ({
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
const shouldNumbersDiffer = (a, b) => {
    return Number(a ?? 0) !== Number(b ?? 0);
};
const compareStrings = (a, b) => {
    return (a ?? '') !== (b ?? '');
};
const syncWithRetry = async (userId, operation, tokenRef, payload, method = 'POST') => {
    let response = await callSyncApi(operation, tokenRef.current, payload, method);
    if (response.ok || response.status !== 401) {
        return response;
    }
    const refreshed = await (0, exports.refreshToken)(userId);
    if (!refreshed.ok) {
        return response;
    }
    tokenRef.current = refreshed.accessToken;
    return callSyncApi(operation, tokenRef.current, payload, method);
};
const syncDown = async (userId) => {
    try {
        const state = await getUserTokenState(userId);
        const tokenResult = await ensureAccessToken(userId, state);
        if (!tokenResult.ok) {
            return { ok: false, error: tokenResult.error, needsAuth: tokenResult.needsAuth };
        }
        const tokenRef = { current: tokenResult.token };
        let remoteResponse = await callSyncApi('GetItems', tokenRef.current, { memberExternalId: userId }, 'GET');
        if (!remoteResponse.ok && remoteResponse.status === 401) {
            const refreshed = await (0, exports.refreshToken)(userId);
            if (!refreshed.ok) {
                return { ok: false, error: refreshed.error, needsAuth: true };
            }
            tokenRef.current = refreshed.accessToken;
            remoteResponse = await callSyncApi('GetItems', tokenRef.current, { memberExternalId: userId }, 'GET');
        }
        if (!remoteResponse.ok) {
            return { ok: false, error: remoteResponse.error || 'Unable to load MyRegistry items.' };
        }
        const remoteItems = normalizeRemoteItems(remoteResponse.data);
        const localItems = await prisma_1.prisma.registryItem.findMany({
            where: { userId },
            include: { product: true },
        });
        const localByRemote = new Map(localItems.filter((item) => item.myRegistryId).map((item) => [item.myRegistryId, item]));
        const conflicts = [];
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
                const updates = {};
                const comparisons = [
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
                        await (0, conflict_service_1.clearConflict)({ userId, itemId: existing.id, field: comparison.field });
                        continue;
                    }
                    if (localChanged && remoteChanged) {
                        conflicts.push({
                            userId,
                            itemId: existing.id,
                            field: comparison.field,
                            localValue: valueToString(comparison.field === 'quantity'
                                ? existing.quantity
                                : comparison.field === 'status'
                                    ? existing.status
                                    : comparison.field === 'customNote'
                                        ? existing.notes
                                        : existing.url),
                            remoteValue: valueToString(comparison.remoteValue),
                        });
                        continue;
                    }
                    if (remoteChanged || !localChanged) {
                        comparison.apply();
                        await (0, conflict_service_1.clearConflict)({ userId, itemId: existing.id, field: comparison.field });
                    }
                }
                if (Object.keys(updates).length) {
                    await prisma_1.prisma.registryItem.update({
                        where: { id: existing.id },
                        data: updates,
                    });
                }
            }
            else {
                await prisma_1.prisma.registryItem.create({
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
            await prisma_1.prisma.registryItem.updateMany({
                where: { id: { in: orphaned } },
                data: { status: client_1.RegistryStatus.REMOVED_REMOTE },
            });
        }
        if (conflicts.length) {
            await (0, conflict_service_1.recordConflicts)(conflicts);
        }
        const lastSync = new Date();
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { myRegistryLastSyncedAt: lastSync },
        });
        const refreshedItems = await prisma_1.prisma.registryItem.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'asc' },
        });
        const activeConflicts = await (0, conflict_service_1.listActiveConflicts)(userId);
        return { ok: true, items: refreshedItems, conflicts: activeConflicts, lastSync };
    }
    catch (error) {
        return { ok: false, error: error?.message || 'Unable to sync with MyRegistry.' };
    }
};
exports.syncDown = syncDown;
const syncUp = async (userId) => {
    try {
        const state = await getUserTokenState(userId);
        const tokenResult = await ensureAccessToken(userId, state);
        if (!tokenResult.ok) {
            return { ok: false, error: tokenResult.error, needsAuth: tokenResult.needsAuth };
        }
        const tokenRef = { current: tokenResult.token };
        const items = await prisma_1.prisma.registryItem.findMany({
            where: { userId },
            include: { product: true },
        });
        const creations = items.filter((item) => !item.myRegistryId);
        const updates = items.filter((item) => item.myRegistryId && item.status !== client_1.RegistryStatus.REMOVED_REMOTE);
        const removals = items.filter((item) => item.myRegistryId && item.status === client_1.RegistryStatus.REMOVED_REMOTE);
        for (const item of creations) {
            const payload = {
                ...buildRemotePayload(item, userId),
                memberExternalId: userId,
            };
            const response = await syncWithRetry(userId, 'AddGift', tokenRef, payload);
            if (!response.ok)
                continue;
            const giftId = response.data?.giftId || response.data?.GiftId || response.data?.id;
            if (giftId) {
                await prisma_1.prisma.registryItem.update({
                    where: { id: item.id },
                    data: { myRegistryId: String(giftId) },
                });
            }
        }
        for (const item of updates) {
            if (!item.myRegistryId)
                continue;
            const payload = {
                ...buildRemotePayload(item, userId),
                giftId: item.myRegistryId,
            };
            await syncWithRetry(userId, 'UpdateGift', tokenRef, payload);
        }
        for (const item of removals) {
            if (!item.myRegistryId)
                continue;
            await syncWithRetry(userId, 'RemoveGift', tokenRef, { giftId: item.myRegistryId });
        }
        const lastSync = new Date();
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { myRegistryLastSyncedAt: lastSync },
        });
        const refreshedItems = await prisma_1.prisma.registryItem.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'asc' },
        });
        const activeConflicts = await (0, conflict_service_1.listActiveConflicts)(userId);
        return { ok: true, items: refreshedItems, conflicts: activeConflicts, lastSync };
    }
    catch (error) {
        return { ok: false, error: error?.message || 'Unable to push updates to MyRegistry.' };
    }
};
exports.syncUp = syncUp;
const isConnected = async (userId) => {
    if (!(0, exports.isMyRegistryConfigured)())
        return false;
    const state = await getUserTokenState(userId);
    if (state?.myRegistryAccessToken) {
        return true;
    }
    const existing = await prisma_1.prisma.registryItem.findFirst({
        where: { userId, myRegistryId: { not: null } },
        select: { id: true },
    });
    return Boolean(existing);
};
exports.isConnected = isConnected;
const addGift = async ({ userId, title, url, price, image }) => {
    const response = await (0, exports.addGiftToMyRegistry)({
        memberExternalId: userId,
        productName: title,
        affiliateUrl: url,
        merchant: 'Custom',
        quantity: 1,
        price: price ?? null,
        notes: image ?? undefined,
    });
    const giftId = response.data?.giftId;
    return typeof giftId === 'string' ? giftId : null;
};
exports.addGift = addGift;

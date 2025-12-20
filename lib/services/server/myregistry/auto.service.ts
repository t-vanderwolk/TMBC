import type { AxiosInstance, AxiosStatic } from 'axios';

const axios = require('axios') as AxiosStatic;
const { isAxiosError } = axios;
import crypto from 'crypto';

const SYNC_BASE_URL = process.env.MYREGISTRY_SYNC_BASE_URL ?? 'https://api.myregistry.com/RegistryApi/1/0/json/';
const OAUTH_URL = process.env.MYREGISTRY_OAUTH_URL ?? 'https://api.myregistry.com/oauth/token';
const PARTNER_KEY = process.env.MYREGISTRY_PARTNER_KEY;
const PARTNER_SECRET = process.env.MYREGISTRY_PARTNER_SECRET;
const REDIRECT_URI = process.env.MYREGISTRY_REDIRECT_URI;

const handleError = (error: unknown): never => {
  if (isAxiosError(error)) {
    const message = error.response?.data ?? error.message;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  throw error instanceof Error ? error : new Error('MyRegistry request failed');
};

const createClient = () => {
  if (!PARTNER_KEY) {
    throw new Error('Missing MYREGISTRY_PARTNER_KEY');
  }
  const config = {
    baseURL: SYNC_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'x-partner-key': PARTNER_KEY,
      ...(PARTNER_SECRET ? { 'x-partner-secret': PARTNER_SECRET } : {}),
    },
  };
  return axios.create(config);
};

let client: AxiosInstance | null = null;
const getClient = (): AxiosInstance => {
  if (!client) client = createClient();
  return client!;
};

const isConfigured = () => Boolean(PARTNER_KEY && PARTNER_SECRET && OAUTH_URL && REDIRECT_URI);

const normalizeSignupResponse = (payload: Record<string, unknown>) => {
  const registryId =
    (payload['RegistryId'] as string) ??
    (payload['registryId'] as string) ??
    (payload['RegistryUserId'] as string) ??
    (payload['RegistryUserUuid'] as string) ??
    '';
  const userId =
    (payload['UserId'] as string) ??
    (payload['userId'] as string) ??
    (payload['MemberId'] as string) ??
    (payload['memberId'] as string) ??
    '';
  const email =
    (payload['Email'] as string) ??
    (payload['email'] as string) ??
    (payload['RegistryEmail'] as string) ??
    '';
  return { registryId, userId, email };
};

type OAuthPayload = {
  grant_type: string;
  username?: string;
  password?: string;
  refresh_token?: string;
};

type OAuthResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: string;
};

const parseExpiry = (payload: OAuthResponse): Date | null => {
  if (payload.expires_at) {
    const parsed = new Date(payload.expires_at);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  if (typeof payload.expires_in === 'number') {
    return new Date(Date.now() + payload.expires_in * 1000);
  }
  return null;
};

const callOAuth = async (payload: OAuthPayload): Promise<OAuthResponse> => {
  if (!PARTNER_KEY || !PARTNER_SECRET || !REDIRECT_URI) {
    throw new Error('MyRegistry OAuth configuration is incomplete.');
  }
  try {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    params.append('client_id', PARTNER_KEY);
    params.append('client_secret', PARTNER_SECRET);
    params.append('redirect_uri', REDIRECT_URI);

    const response = await axios.post(OAUTH_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data as OAuthResponse;
  } catch (error) {
    return handleError(error);
  }
};

const extractItemId = (payload: Record<string, unknown>): string | null => {
  const candidateKeys = ['ItemId', 'itemId', 'giftId', 'GiftId', 'id', 'Id'];
  for (const key of candidateKeys) {
    const value = payload[key];
    if (value) {
      return String(value);
    }
  }
  return null;
};

export type CreateUserAndRegistryPayload = {
  email: string;
  firstName: string;
  lastName: string;
  city?: string;
  state?: string;
  country?: string;
};

export type MyRegistryCredentials = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
};

export type MyRegistryAccount = {
  myRegistryUserId: string;
  myRegistryRegistryId: string;
  myRegistryEmail: string;
  credentials: MyRegistryCredentials;
  createdAt: Date;
};

export const MyRegistryAutomation = {
  isConfigured,

  async createUserAndRegistry(payload: CreateUserAndRegistryPayload): Promise<MyRegistryAccount> {
    if (!isConfigured()) {
      throw new Error('MyRegistry automation is not configured.');
    }
    const password = crypto.randomBytes(16).toString('hex');
    const signupPayload: Record<string, unknown> = {
      Email: payload.email,
      Password: password,
      FirstName: payload.firstName,
      LastName: payload.lastName,
    };
    if (payload.city) signupPayload.City = payload.city;
    if (payload.state) signupPayload.State = payload.state;
    if (payload.country) signupPayload.Country = payload.country;

    const response = await getClient().post('SignupUser', signupPayload);
    const normalized = normalizeSignupResponse(response.data ?? {});
    if (!normalized.registryId) {
      throw new Error('MyRegistry did not return a registry identifier.');
    }
    if (!normalized.userId && !normalized.registryId) {
      throw new Error('MyRegistry did not return a user identifier.');
    }

    const tokenPayload = await callOAuth({
      grant_type: 'password',
      username: payload.email,
      password,
    });

    return {
      myRegistryUserId: normalized.userId || normalized.registryId,
      myRegistryRegistryId: normalized.registryId,
      myRegistryEmail: normalized.email || payload.email,
      credentials: {
        accessToken: tokenPayload.access_token,
        refreshToken: tokenPayload.refresh_token ?? null,
        expiresAt: parseExpiry(tokenPayload),
      },
      createdAt: new Date(),
    };
  },

  async refreshToken(refreshToken: string): Promise<MyRegistryCredentials> {
    if (!refreshToken) {
      throw new Error('Missing refresh token.');
    }
    if (!isConfigured()) {
      throw new Error('MyRegistry automation is not configured.');
    }
    const tokenPayload = await callOAuth({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    return {
      accessToken: tokenPayload.access_token,
      refreshToken: tokenPayload.refresh_token ?? null,
      expiresAt: parseExpiry(tokenPayload),
    };
  },

  async createRegistryItem(payload: {
    registryId: string;
    title: string;
    description?: string;
    price?: number;
    imageUrl?: string;
  }): Promise<{ itemId: string }> {
    if (!payload.registryId) {
      throw new Error('Registry ID is required.');
    }
    if (!payload.title) {
      throw new Error('Registry item title is required.');
    }
    if (!isConfigured()) {
      throw new Error('MyRegistry automation is not configured.');
    }
    try {
      const response = await getClient().post('AddItemToRegistry', {
        RegistryId: payload.registryId,
        ItemName: payload.title,
        Description: payload.description,
        Price: payload.price,
        ImageUrl: payload.imageUrl,
      });
      const itemId = extractItemId(response.data ?? {});
      if (!itemId) {
        throw new Error('MyRegistry did not return an item identifier.');
      }
      return { itemId };
    } catch (error) {
      return handleError(error);
    }
  },

  async markPurchased(params: { registryId: string; itemId: string; purchased?: boolean }) {
    if (!params.registryId || !params.itemId) {
      throw new Error('Registry ID and item ID are required for marking purchases.');
    }
    if (!isConfigured()) {
      throw new Error('MyRegistry automation is not configured.');
    }
    try {
      await getClient().post('SetGiftAsPurchased', {
        RegistryId: params.registryId,
        ItemId: params.itemId,
        Purchased: params.purchased ?? true,
      });
    } catch (error) {
      handleError(error);
    }
  },
};

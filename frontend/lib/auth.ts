"use client";

type ClientUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  title?: string;
  token?: string;
};

const SESSION_TOKEN_KEY = 'tm_token';
const SESSION_USER_KEY = 'tm_user';
const LEGACY_TOKEN_KEY = 'tmbc_token';

const ensureClient = () => typeof window !== 'undefined';

const normalizeRole = (role?: string) => role?.toUpperCase() ?? 'MEMBER';

const decodeTokenPayload = (token: string | null) => {
  if (!token || !ensureClient()) return null;

  try {
    const payloadSegment = token.includes('.') ? token.split('.')[1] : token;
    const decoded = window.atob(payloadSegment);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const buildClientUser = (payload: any): ClientUser | null => {
  if (!payload) return null;
  if (!payload.id || !payload.email) return null;
  return {
    id: String(payload.id),
    email: String(payload.email),
    name: payload.name ?? payload.firstName ?? payload.displayName ?? '',
    role: normalizeRole(payload.role),
    title: payload.title,
  };
};

const syncUserFromToken = (token: string) => {
  const payload = decodeTokenPayload(token);
  const user = buildClientUser(payload);
  if (!user) return null;
  localStorage.setItem(
    SESSION_USER_KEY,
    JSON.stringify({
      ...user,
      token,
    }),
  );
  return user;
};

export const saveSession = ({ token, user }: { token: string; user: ClientUser }) => {
  if (!ensureClient()) return;
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(
    SESSION_USER_KEY,
    JSON.stringify({
      ...user,
      role: normalizeRole(user.role),
      token,
    }),
  );
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
  document.cookie = `tm_token=${token}; path=/`;
};

export const getSessionToken = () => {
  if (!ensureClient()) return null;
  return (
    localStorage.getItem(SESSION_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY) ||
    null
  );
};

export const getClientUser = () => {
  if (!ensureClient()) return null;

  const stored = localStorage.getItem(SESSION_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(SESSION_USER_KEY);
    }
  }

  const token = getSessionToken();
  if (!token) return null;
  return syncUserFromToken(token);
};

export const clearSession = () => {
  if (!ensureClient()) return;
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  document.cookie = 'tm_token=; path=/; max-age=0';
};

const saveTokenOnly = (token: string) => {
  if (!ensureClient()) return;
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
  document.cookie = `tm_token=${token}; path=/`;
  syncUserFromToken(token);
};

export const Auth = {
  save(token: string) {
    saveTokenOnly(token);
  },

  get(): string | null {
    return getSessionToken();
  },

  clear() {
    clearSession();
  },

  decode() {
    const token = getSessionToken();
    if (!token) return null;
    return decodeTokenPayload(token);
  },
};

export type SessionPayload = {
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  [key: string]: any;
};

export type Session = {
  token: string;
  payload: SessionPayload;
};

export const loadSession = (): Session | null => {
  const token = Auth.get();
  if (!token) return null;

  const payload = Auth.decode();
  if (!payload) {
    Auth.clear();
    return null;
  }

  return { token, payload };
};

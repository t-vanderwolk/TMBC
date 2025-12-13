"use client";

import { api } from "@/lib/api";
import { routeForRole } from "@/lib/auth/routeForRole";

export type StoredUser = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  title?: string;
  token?: string;
  onboardingComplete?: boolean;
  profileCompleted?: boolean;
  inviteCodeUsed?: boolean;
};

const SESSION_TOKEN_KEY = 'tm_token';
const SESSION_USER_KEY = 'tm_user';
const LEGACY_TOKEN_KEY = 'tmbc_token';

const ensureClient = () => typeof window !== 'undefined';

const normalizeRole = (role?: string) => role?.toUpperCase() ?? 'MEMBER';

const decodeTokenPayload = (token: string | null) => {
  if (!token || !ensureClient()) return null;

  try {
    const segments = token.split('.');
    const payloadSegment = segments.length > 1 ? segments[1] : segments[0];
    if (!payloadSegment) return null;
    const decoded = window.atob(payloadSegment);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const buildStoredUser = (payload: any, token?: string): StoredUser | null => {
  if (!payload) return null;
  if (!payload.id || !payload.email) return null;
  return {
    id: String(payload.id),
    email: String(payload.email),
    name: payload.name ?? payload.firstName ?? payload.displayName ?? '',
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: normalizeRole(payload.role),
    title: payload.title,
    onboardingComplete: Boolean(payload.onboardingComplete),
    profileCompleted: Boolean(payload.profileCompleted),
    inviteCodeUsed: Boolean(payload.inviteCodeUsed),
    token,
  };
};

const persistStoredUser = (user: StoredUser) => {
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
};

const syncUserFromToken = (token: string): StoredUser | null => {
  const payload = decodeTokenPayload(token);
  const user = buildStoredUser(payload, token);
  if (!user) return null;
  persistStoredUser(user);
  return user;
};

export const saveSession = async ({
  token,
  user,
}: {
  token: string;
  user?: StoredUser;
}) => {
  if (!ensureClient()) return null;
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
  document.cookie = `tm_token=${token}; path=/`;

  if (user) {
    const normalizedUser: StoredUser = {
      ...user,
      role: normalizeRole(user.role),
      onboardingComplete: Boolean(user.onboardingComplete),
      profileCompleted: Boolean(user.profileCompleted),
      inviteCodeUsed: Boolean(user.inviteCodeUsed),
      token,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    persistStoredUser(normalizedUser);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    return normalizedUser;
  }

  return syncUserFromToken(token);
};

export const getSessionToken = () => {
  if (!ensureClient()) return null;
  return (
    localStorage.getItem(SESSION_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY) ||
    null
  );
};

export const getStoredUser = (): StoredUser | null => {
  if (!ensureClient()) return null;
  const stored = localStorage.getItem(SESSION_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
};

export const getClientUser = () => {
  if (!ensureClient()) return null;

  const stored = getStoredUser();
  if (stored) {
    return stored;
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

export const Auth = {
  save(token: string) {
    saveSession({ token });
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

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const data = res.data || {};
  console.log("FRONTEND RAW LOGIN RESPONSE:", data);

  const dashboard =
    data.dashboard || data.redirect || routeForRole(data.user?.role);

  return {
    ...data,
    dashboard,
    redirect: dashboard,
  };
}

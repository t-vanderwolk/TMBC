"use server";

import { cookies, headers } from 'next/headers';
import { supabaseAdmin } from './supabaseClient';
import { prisma } from '@/lib/prisma';
import { Role, type User } from '@prisma/client';

type RequestLike = Request | undefined;

const COOKIE_NAMES = ['sb-access-token', 'supabase-access-token', 'supabase-auth-token'];

const extractToken = (request?: RequestLike) => {
  const fromHeader = request?.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (fromHeader) return fromHeader;
  const fromAuthHeaders = headers().get('authorization')?.replace(/^Bearer\s+/i, '');
  if (fromAuthHeaders) return fromAuthHeaders;
  for (const cookieName of COOKIE_NAMES) {
    const cookie = cookies().get(cookieName)?.value;
    if (cookie) return cookie;
  }
  return null;
};

export async function getUserOrThrow(request?: RequestLike) {
  const token = extractToken(request);
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      throw new Error('Unable to resolve Supabase user');
    }

    const profile = await prisma.user.findUnique({
      where: { email: data.user.email ?? undefined },
    });

    if (!profile) {
      throw new Error('User not registered in TMBC database');
    }

    return profile;
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && isDevNetworkError(error)) {
      console.warn('[dev] Supabase unavailable; returning fallback user.');
      return createDevFallbackUser();
    }
    throw error;
  }
}

const isDevNetworkError = (error: unknown) => {
  if (!(error instanceof Error)) return false;
  return /Failed to fetch|NetworkError|ENOTFOUND|ECONNREFUSED/i.test(error.message);
};

// Dev-only fallback user when Supabase network is unreachable locally.
const createDevFallbackUser = (): User => ({
  id: 'dev-user',
  email: 'dev@localhost',
  password: 'dev-placeholder',
  name: 'Dev Fallback',
  role: Role.MEMBER,
  createdAt: new Date('2020-01-01T00:00:00.000Z'),
  updatedAt: new Date('2020-01-01T00:00:00.000Z'),
  myRegistryAccessToken: null,
  myRegistryRefreshToken: null,
  myRegistryTokenExpires: null,
  myRegistryLastSyncedAt: null,
  pinterestAccessToken: null,
  pinterestRefreshToken: null,
  pinterestTokenExpires: null,
  myRegistryEmail: null,
  myRegistryUserId: null,
  disabled: false,
  dueDate: null,
  inviteCodeUsed: false,
  location: null,
  mentorId: null,
  onboardingComplete: true,
  profileCompleted: true,
});

import axios from 'axios';

import { prisma } from '../utils/prisma';

const ensurePinterestConfig = () => {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Pinterest configuration is incomplete');
  }

  return { clientId, clientSecret, redirectUri };
};

const buildState = (userId: string) =>
  Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64');

const parseState = (state: string | undefined) => {
  if (!state) return null;
  try {
    const decoded = Buffer.from(state, 'base64').toString('utf-8');
    return JSON.parse(decoded) as { userId: string };
  } catch {
    return null;
  }
};

type PinterestTokenRecord = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
};

export type PinterestPinPayload = {
  imageUrl: string;
  note: string;
  title?: string;
  link?: string;
  boardId?: string;
};

export const getPinterestAuthUrl = (userId: string) => {
  const { clientId, redirectUri } = ensurePinterestConfig();
  const url = new URL('https://www.pinterest.com/oauth/');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'pins:read,pins:write');
  url.searchParams.set('state', buildState(userId));
  return url.toString();
};

export const exchangePinterestCode = async (code: string) => {
  const { clientId, clientSecret, redirectUri } = ensurePinterestConfig();
  const response = await axios.post(
    'https://api.pinterest.com/v5/oauth/token',
    {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };
};

export const storePinterestToken = async (userId: string, tokenData: { accessToken: string; refreshToken?: string; expiresIn?: number }) => {
  const expiresAt = tokenData.expiresIn ? new Date(Date.now() + tokenData.expiresIn * 1000) : undefined;
  await prisma.user.update({
    where: { id: userId },
    data: {
      pinterestAccessToken: tokenData.accessToken,
      pinterestRefreshToken: tokenData.refreshToken,
      pinterestTokenExpires: expiresAt,
    },
  });
};

export const getStoredPinterestToken = async (userId: string): Promise<PinterestTokenRecord | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      pinterestAccessToken: true,
      pinterestRefreshToken: true,
      pinterestTokenExpires: true,
    },
  });

  if (!user?.pinterestAccessToken) {
    return null;
  }

  if (user.pinterestTokenExpires && user.pinterestTokenExpires < new Date()) {
    return null;
  }

  return {
    accessToken: user.pinterestAccessToken,
    refreshToken: user.pinterestRefreshToken ?? undefined,
    expiresAt: user.pinterestTokenExpires ?? undefined,
  };
};

export const createPinterestPin = async (userId: string, payload: PinterestPinPayload) => {
  const token = await getStoredPinterestToken(userId);
  if (!token) {
    throw new Error('Pinterest credentials are missing or expired');
  }

  const body: Record<string, unknown> = {
    note: payload.note,
    image_url: payload.imageUrl,
  };

  if (payload.title) {
    body.title = payload.title;
  }

  if (payload.link) {
    body.link = payload.link;
  }

  const defaultBoardId = process.env.PINTEREST_DEFAULT_BOARD_ID;
  const boardId = payload.boardId || defaultBoardId;
  if (boardId) {
    body.board_id = boardId;
  }

  const response = await axios.post('https://api.pinterest.com/v5/pins', body, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const decodePinterestState = (state: string | undefined) => {
  return parseState(state);
};

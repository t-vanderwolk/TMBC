import type { NextRequest } from "next/server";

const isProd = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_NAMES = ["tm_token", "tmbc_token"] as const;
export const PRIMARY_AUTH_COOKIE = AUTH_COOKIE_NAMES[0];
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type BaseCookieOptions = {
  path: string;
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  domain?: string;
};

const baseOptions = (isSecure: boolean): BaseCookieOptions => ({
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: isSecure,
});

const rawCookieDomain =
  process.env.AUTH_COOKIE_DOMAIN ?? process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN;
const COOKIE_DOMAIN = rawCookieDomain?.trim() || undefined;

export const buildAuthCookieOptions = (
  request?: NextRequest,
  overrides?: { maxAge?: number },
) => {
  const secure =
    isProd || Boolean(request?.nextUrl.protocol === "https:");
  return {
    ...baseOptions(secure),
    ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
    ...(overrides ?? {}),
  };
};

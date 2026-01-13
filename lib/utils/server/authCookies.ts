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
};

const baseOptions = (isSecure: boolean): BaseCookieOptions => ({
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: isSecure,
});

export const buildAuthCookieOptions = (
  request?: NextRequest,
  overrides?: { maxAge?: number },
) => {
  const secure =
    isProd || Boolean(request?.nextUrl.protocol === "https:");
  return {
    ...baseOptions(secure),
    ...(overrides ?? {}),
  };
};

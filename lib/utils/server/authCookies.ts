// "use server";

const isProd = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_NAMES = ["tm_token", "tmbc_token"] as const;
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type BaseCookieOptions = {
  path: string;
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
};

const BASE_COOKIE_OPTIONS: BaseCookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: isProd,
};

export const buildAuthCookieOptions = (overrides?: { maxAge?: number }) => ({
  ...BASE_COOKIE_OPTIONS,
  ...(overrides ?? {}),
});

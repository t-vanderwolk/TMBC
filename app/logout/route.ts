import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAMES, buildAuthCookieOptions } from "@/lib/utils/server/authCookies";

const getRedirectUrl = () => {
  const url =
    process.env.FRONTEND_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  return new URL("/login", url);
};

export async function GET() {
  const response = NextResponse.redirect(getRedirectUrl());
  const expiredOptions = buildAuthCookieOptions({ maxAge: 0 });
  for (const name of AUTH_COOKIE_NAMES) {
    response.cookies.set(name, "", expiredOptions);
  }
  return response;
}

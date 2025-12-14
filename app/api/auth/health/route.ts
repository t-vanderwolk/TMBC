// "use server";

import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAMES } from "@/lib/utils/server/authCookies";
import { verifyToken } from "@/lib/utils/server/jwt";

export async function GET(request: NextRequest) {
  const token =
    AUTH_COOKIE_NAMES.map((name) => request.cookies.get(name)?.value).find(
      Boolean,
    ) ?? null;

  const jwtSecret = Boolean(process.env.JWT_SECRET);
  let userAuthenticated = false;

  if (token && jwtSecret) {
    try {
      verifyToken(token);
      userAuthenticated = true;
    } catch {
      userAuthenticated = false;
    }
  }

  return NextResponse.json({
    jwtSecret,
    cookiePresent: Boolean(token),
    userAuthenticated,
  });
}

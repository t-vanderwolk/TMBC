"use server";

import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAMES, buildAuthCookieOptions } from "@/lib/utils/server/authCookies";

const COOKIE_NAMES_TO_CLEAR = [
  ...AUTH_COOKIE_NAMES,
  "sb-access-token",
  "sb-refresh-token",
  "supabase-access-token",
  "supabase-refresh-token",
  "supabase-auth-token",
];

const clearAuthCookies = (response: NextResponse, request?: NextRequest) => {
  const expired = buildAuthCookieOptions(request, { maxAge: 0 });
  for (const cookieName of COOKIE_NAMES_TO_CLEAR) {
    response.cookies.set(cookieName, "", expired);
  }
};

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response, request);
  return response;
}

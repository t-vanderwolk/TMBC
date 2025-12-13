"use server";

import { NextResponse } from "next/server";

const COOKIE_NAMES_TO_CLEAR = [
  "tm_token",
  "tmbc_token",
  "sb-access-token",
  "sb-refresh-token",
  "supabase-access-token",
  "supabase-refresh-token",
  "supabase-auth-token",
];

const clearAuthCookies = (response: NextResponse) => {
  for (const cookieName of COOKIE_NAMES_TO_CLEAR) {
    response.cookies.set(cookieName, "", {
      path: "/",
      maxAge: 0,
    });
  }
};

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}

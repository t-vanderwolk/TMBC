"use server";

import { NextRequest, NextResponse } from "next/server";

import { AuthService } from "@/lib/services/server/auth.service";

import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAMES,
  buildAuthCookieOptions,
} from "@/lib/utils/server/authCookies";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  const { email, password } = payload || {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const result = await AuthService.loginUser(String(email), String(password));
    const response = NextResponse.json(result);
    const authCookieOptions = buildAuthCookieOptions({ maxAge: AUTH_COOKIE_MAX_AGE });

    for (const name of AUTH_COOKIE_NAMES) {
      response.cookies.set(name, result.token, authCookieOptions);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to log in.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

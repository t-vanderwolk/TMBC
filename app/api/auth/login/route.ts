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
    const { user } = result;
    const userResponse = {
      ...user,
      onboardingComplete: Boolean(user?.onboardingComplete),
      profileCompleted: Boolean(user?.profileCompleted),
      inviteCodeUsed: Boolean(user?.inviteCodeUsed),
    };
    const responsePayload = {
      success: true,
      user: userResponse,
      token: result.token,
      dashboard: result.dashboard,
      redirect: result.redirect,
    };
    const response = NextResponse.json(responsePayload);
    const authCookieOptions = buildAuthCookieOptions({ maxAge: AUTH_COOKIE_MAX_AGE });

    for (const name of AUTH_COOKIE_NAMES) {
      response.cookies.set(name, result.token, authCookieOptions);
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Login error", error);
    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 500 },
    );
  }
}

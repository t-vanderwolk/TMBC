import { NextRequest, NextResponse } from "next/server";

import { INVITE_COOKIE_MAX_AGE, INVITE_COOKIE_NAME } from "@/lib/constants/invite";
import { validateInviteCode } from "@/lib/services/server/onboarding.service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { code } = payload ?? {};

    if (!code) {
      return NextResponse.json({ error: "Invite code is required." }, { status: 400 });
    }

    const invite = await validateInviteCode(String(code).trim().toUpperCase());

    const response = NextResponse.json({ invite });
    response.cookies.set(INVITE_COOKIE_NAME, invite.code, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: INVITE_COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to validate invite.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

import { INVITE_COOKIE_NAME } from '@/lib/constants/invite';
import { finishInviteOnboarding } from '@/lib/services/server/onboarding.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { code, name, password } = payload ?? {};
    const cookieCode = request.cookies.get(INVITE_COOKIE_NAME)?.value;
    const resolvedCode = String(code || cookieCode || "").trim().toUpperCase();

    if (!resolvedCode || !name || !password) {
      return NextResponse.json(
        { error: 'Invite code, name, and password are required.' },
        { status: 400 },
      );
    }

    const result = await finishInviteOnboarding({
      code: resolvedCode,
      name: String(name),
      password: String(password),
    });

    const response = NextResponse.json(result);
    response.cookies.set(INVITE_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to complete invite onboarding.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

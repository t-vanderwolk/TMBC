import { NextRequest, NextResponse } from 'next/server';

import { INVITE_COOKIE_NAME } from '@/lib/constants/invite';
import { validateInviteCode } from '@/lib/services/server/onboarding.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { code } = payload ?? {};
    const cookieCode = request.cookies.get(INVITE_COOKIE_NAME)?.value;
    const resolvedCode = String(code || cookieCode || "").trim().toUpperCase();

    if (!resolvedCode) {
      return NextResponse.json({ error: 'Invite code is required.' }, { status: 400 });
    }

    const invite = await validateInviteCode(resolvedCode);
    return NextResponse.json({ invite });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to validate invite.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

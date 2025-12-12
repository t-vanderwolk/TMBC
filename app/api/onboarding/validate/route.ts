import { NextRequest, NextResponse } from 'next/server';

import { validateInviteCode } from '@/lib/services/server/onboarding.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { code } = payload ?? {};

    if (!code) {
      return NextResponse.json({ error: 'Invite code is required.' }, { status: 400 });
    }

    const invite = await validateInviteCode(String(code));
    return NextResponse.json({ invite });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to validate invite.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

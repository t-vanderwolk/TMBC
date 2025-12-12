import { NextRequest, NextResponse } from 'next/server';

import { finishInviteOnboarding } from '@/lib/services/server/onboarding.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { code, name, password } = payload ?? {};

    if (!code || !name || !password) {
      return NextResponse.json(
        { error: 'Invite code, name, and password are required.' },
        { status: 400 },
      );
    }

    const result = await finishInviteOnboarding({
      code: String(code),
      name: String(name),
      password: String(password),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to complete invite onboarding.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

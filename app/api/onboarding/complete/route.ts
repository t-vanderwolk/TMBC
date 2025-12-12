import { NextRequest, NextResponse } from 'next/server';

import { completeOnboarding } from '@/lib/services/server/onboarding.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { userId } = payload ?? {};

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const user = await completeOnboarding(String(userId));
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to mark onboarding complete.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

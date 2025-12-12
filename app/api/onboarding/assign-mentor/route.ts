import { NextRequest, NextResponse } from 'next/server';

import { assignMentor } from '@/lib/services/server/onboarding.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { userId } = payload ?? {};

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const mentor = await assignMentor(String(userId));
    return NextResponse.json({ mentor });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to assign a mentor.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

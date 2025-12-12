import { NextRequest, NextResponse } from 'next/server';

import { saveProfile } from '@/lib/services/server/onboarding.service';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { userId, name, dueDate, location } = payload ?? {};

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const user = await saveProfile({
      userId: String(userId),
      name: name ? String(name) : undefined,
      dueDate: dueDate ? String(dueDate) : undefined,
      location: location ? String(location) : undefined,
    });

    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save profile.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

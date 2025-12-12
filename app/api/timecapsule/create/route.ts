import { NextRequest, NextResponse } from 'next/server';
import { createCapsule } from '@/lib/services/timecapsule.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  const capsule = await createCapsule(user.id, payload);
  return NextResponse.json({ capsule });
}

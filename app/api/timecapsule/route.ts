import { NextRequest, NextResponse } from 'next/server';
import { getUserCapsules } from '@/lib/services/timecapsule.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const capsules = await getUserCapsules(user.id);
  return NextResponse.json({ capsules });
}

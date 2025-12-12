import { NextRequest, NextResponse } from 'next/server';
import { rsvpEvent } from '@/lib/services/events.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  await rsvpEvent(user.id, payload.eventId?.toString() ?? '', payload.status);
  return NextResponse.json({ success: true });
}

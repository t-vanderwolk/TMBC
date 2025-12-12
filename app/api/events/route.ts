import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, getUpcomingEvents } from '@/lib/services/events.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest) {
  await getUserOrThrow(request);
  const events = await getAllEvents();
  const upcoming = await getUpcomingEvents();
  return NextResponse.json({ events, upcoming });
}

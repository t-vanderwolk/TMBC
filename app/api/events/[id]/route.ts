import { NextRequest, NextResponse } from 'next/server';
import { getEvent } from '@/lib/services/events.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await getUserOrThrow(request);
  const event = await getEvent(Number(params.id));
  if (!event) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ event });
}

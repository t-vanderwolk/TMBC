import { NextRequest, NextResponse } from 'next/server';

import { addToWaitlist } from '@/lib/services/server/waitlist.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown> | null = null;
  try {
    payload = await request.json();
  } catch (error) {
    console.warn('[Waitlist API] Unable to parse payload', error);
  }

  const email = String(payload?.email ?? '').trim();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const entry = await addToWaitlist({
    email,
    name: typeof payload?.name === 'string' ? payload.name.trim() : undefined,
    source: typeof payload?.source === 'string' ? payload.source.trim() : undefined,
    note: typeof payload?.note === 'string' ? payload.note.trim() : undefined,
  });

  console.info(`[Waitlist] Added ${email} from ${payload?.source ?? 'unknown source'}`);
  return NextResponse.json({ data: entry });
}

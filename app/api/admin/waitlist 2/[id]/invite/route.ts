import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { getUserOrThrow } from '@/lib/auth/getUser';
import { createInviteFromWaitlist } from '@/lib/services/server/invite.service';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const waitlistId = params?.id;
  if (!waitlistId) {
    return NextResponse.json({ error: 'Missing waitlist id' }, { status: 400 });
  }

  let body: { role?: string } = {};
  try {
    body = await request.json();
  } catch (error) {
    console.warn('[Waitlist API] Failed to parse request body', error);
  }

  const invite = await createInviteFromWaitlist({
    waitlistId,
    creatorId: user.id,
    role: body.role,
  });

  return NextResponse.json({ data: invite });
}

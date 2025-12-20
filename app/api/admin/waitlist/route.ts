import { Role } from '@/types/role';
import { NextRequest, NextResponse } from 'next/server';

import { getUserOrThrow } from '@/lib/auth/getUser';
import { getWaitlist } from '@/lib/services/server/waitlist.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const entries = await getWaitlist();
  return NextResponse.json({ data: entries });
}

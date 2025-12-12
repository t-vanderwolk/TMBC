import { NextRequest, NextResponse } from 'next/server';
import { getThreadsForUser } from '@/lib/services/messages.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const threads = await getThreadsForUser(user.id);
  return NextResponse.json({ threads });
}

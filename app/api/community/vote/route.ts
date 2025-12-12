import { NextRequest, NextResponse } from 'next/server';
import { voteInPoll } from '@/lib/services/community.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  const vote = await voteInPoll(user.id, payload.pollId, payload.option);
  return NextResponse.json({ vote });
}

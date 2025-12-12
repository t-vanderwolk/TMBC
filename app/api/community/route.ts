import { NextRequest, NextResponse } from 'next/server';
import { getCommunityFeed } from '@/lib/services/community.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest) {
  await getUserOrThrow(request);
  const feed = await getCommunityFeed();
  return NextResponse.json({ feed });
}

import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/services/community.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  const post = await createPost(user.id, payload.content);
  return NextResponse.json({ post });
}

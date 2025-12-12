import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from '@/lib/services/messages.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest, { params }: { params: { threadId: string } }) {
  await getUserOrThrow(request);
  const messages = await getMessages(Number(params.threadId));
  return NextResponse.json({ messages });
}

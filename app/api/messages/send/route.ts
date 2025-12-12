import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/services/messages.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  const message = await sendMessage(user.id, Number(payload.threadId), payload.content);
  return NextResponse.json({ message });
}

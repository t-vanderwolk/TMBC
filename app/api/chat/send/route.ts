import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { createAndBroadcastMessage } from "@/lib/chat/wsServer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  let payload: { conversationId?: string; content?: string } | null = null;

  try {
    payload = (await request.json()) ?? null;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }

  const conversationId = payload?.conversationId;
  const content = payload?.content?.trim();

  if (!conversationId || !content) {
    return NextResponse.json(
      { error: "Conversation ID and message content are required." },
      { status: 400 },
    );
  }

  try {
    const message = await createAndBroadcastMessage({
      conversationId,
      senderId: user.id,
      content,
    });

    return NextResponse.json({
      message: {
        ...message,
        createdAt: message.createdAt.toISOString(),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to send the message.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

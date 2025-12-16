import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import type { ChatActor } from "@/lib/services/server/chat.service";
import { ChatPermissionError, sendMessage } from "@/lib/services/server/chat.service";

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

  const sender: ChatActor = { id: user.id, name: user.name ?? null, role: user.role };

  try {
    const message = await sendMessage({
      conversationId,
      sender,
      content,
    });

    return NextResponse.json({
      message: {
        ...message,
        createdAt: message.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof ChatPermissionError) {
      console.warn("Chat send blocked", {
        userId: user.id,
        conversationId,
        message: error.message,
      });
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Unable to send the message.";
    console.error("Chat send failed", {
      userId: user.id,
      conversationId,
      error,
    });
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

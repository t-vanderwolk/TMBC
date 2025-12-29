import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { formatConversationResponse } from "@/lib/chat/formatters";
import type { Actor, ChatActor } from "@/lib/services/server/chat.service";
import {
  ChatPermissionError,
  getConversationForUser,
  sendMessage,
  toChatMessageDTO,
} from "@/lib/services/server/chat.service";

export const runtime = "nodejs";

const formatMessage = (message: ReturnType<typeof toChatMessageDTO>) => ({
  ...message,
  createdAt: message.createdAt.toISOString(),
  readAt: message.readAt ? message.readAt.toISOString() : null,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId?: string } },
) {
  const conversationId = params?.conversationId;
  if (!conversationId) {
    return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 });
  }

  const user = await getUserOrThrow(request);

  const actor: Actor = { id: user.id, role: user.role };
  try {
    const convo = await getConversationForUser(conversationId, actor);
    // INTENTIONAL: Mentor-only assistant suggestions are deferred until that experience launches.
    const payload = formatConversationResponse(convo);
    return NextResponse.json({ conversation: payload });
  } catch (error) {
    if (error instanceof ChatPermissionError) {
      console.warn("Unauthorized chat read", { userId: user.id, conversationId, message: error.message });
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Unable to load chat messages", { userId: user.id, conversationId, error });
    return NextResponse.json({ error: "Unable to load messages." }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId?: string } },
) {
  const conversationId = params?.conversationId;
  if (!conversationId) {
    return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 });
  }

  const user = await getUserOrThrow(request);
  let payload: { content?: string; isSystem?: boolean } | null = null;
  try {
    payload = (await request.json()) ?? null;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const content = payload?.content?.trim();
  const isSystem = payload?.isSystem ?? false;
  if (!content) {
    return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
  }

  const sender: ChatActor = { id: user.id, name: user.name ?? null, role: user.role };
  try {
    const message = await sendMessage({
      conversationId,
      sender,
      content,
      isSystem,
    });
    return NextResponse.json({
      message: formatMessage(toChatMessageDTO(message)),
    });
  } catch (error) {
    if (error instanceof ChatPermissionError) {
      console.warn("Unauthorized chat write", {
        userId: user.id,
        conversationId,
        message: error.message,
      });
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to send chat message", {
      userId: user.id,
      conversationId,
      error,
    });
    return NextResponse.json({ error: "Message not sent — try again gently." }, { status: 500 });
  }
}

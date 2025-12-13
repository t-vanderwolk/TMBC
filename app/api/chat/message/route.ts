import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { sendMessage } from "@/lib/services/server/chat.service";
import { getOrCreateConversation } from "@/lib/services/server/chat.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  let payload: { mentorId?: string; memberId?: string; content?: string } | null =
    null;

  try {
    payload = (await request.json()) ?? null;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }

  const mentorId = payload?.mentorId;
  const memberId = payload?.memberId;
  const content = payload?.content?.trim();

  if (!mentorId || !memberId || !content) {
    return NextResponse.json(
      { error: "mentorId, memberId, and content are required." },
      { status: 400 },
    );
  }

  const isMentor = user.id === mentorId;
  const isMember = user.id === memberId;

  if (!isMentor && !isMember) {
    return NextResponse.json(
      { error: "You are not a participant in this conversation." },
      { status: 403 },
    );
  }

  const partnerId = isMentor ? memberId : mentorId;
  const conversation = await getOrCreateConversation(user.id, [partnerId]);

  try {
    const message = await sendMessage({
      conversationId: conversation.id,
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

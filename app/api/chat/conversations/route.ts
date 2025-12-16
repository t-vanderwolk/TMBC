import { NextRequest, NextResponse } from "next/server";

import { Role } from "@prisma/client";
import { getUserOrThrow } from "@/lib/auth/getUser";
import type { Actor } from "@/lib/services/server/chat.service";
import {
  ChatPermissionError,
  createOrGetConversation,
  listUserConversations,
} from "@/lib/services/server/chat.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const actor: Actor = { id: user.id, role: user.role };
  try {
    const conversations = await listUserConversations(actor);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Unable to load chat conversations", { userId: user.id, error });
    const message =
      error instanceof ChatPermissionError ? error.message : "Unable to fetch conversations.";
    return NextResponse.json(
      { error: message },
      { status: error instanceof ChatPermissionError ? error.status : 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  if (![Role.MEMBER, Role.MENTOR, Role.ADMIN].includes(user.role)) {
    console.warn("Chat creation forbidden", { userId: user.id, role: user.role });
    return NextResponse.json({ error: "Role not permitted." }, { status: 403 });
  }

  let payload: { mentorId?: string; memberId?: string } | null = null;
  try {
    payload = (await request.json()) ?? null;
  } catch (error) {
    console.warn("Invalid chat creation payload", { error });
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const mentorId = payload?.mentorId?.trim();
  const memberId = payload?.memberId?.trim();
  if (!mentorId || !memberId) {
    return NextResponse.json(
      { error: "Both mentorId and memberId are required to start a chat." },
      { status: 400 },
    );
  }

  try {
    const actor: Actor = { id: user.id, role: user.role };
    const conversation = await createOrGetConversation(memberId, mentorId, actor);
    return NextResponse.json({ conversation });
  } catch (error) {
    if (error instanceof ChatPermissionError) {
      console.warn("Chat creation blocked", {
        userId: user.id,
        mentorId,
        memberId,
        message: error.message,
      });
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to create chat conversation", {
      userId: user.id,
      mentorId,
      memberId,
      error,
    });
    return NextResponse.json({ error: "Unable to create conversation." }, { status: 500 });
  }
}

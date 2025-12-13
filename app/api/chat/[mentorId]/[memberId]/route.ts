import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  getConversationForUser,
  getOrCreateConversation,
} from "@/lib/services/server/chat.service";
import { formatConversationResponse } from "@/lib/chat/formatters";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { mentorId?: string; memberId?: string } },
) {
  const { mentorId, memberId } = params;
  if (!mentorId || !memberId) {
    return NextResponse.json({ error: "Mentor and member IDs are required." }, { status: 400 });
  }

  const user = await getUserOrThrow(request);
  if (user.id !== mentorId && user.id !== memberId) {
    return NextResponse.json(
      { error: "You are not a participant in this conversation." },
      { status: 403 },
    );
  }

  const conversation = await getOrCreateConversation(user.id, [mentorId, memberId]);
  const resolved = await getConversationForUser(conversation.id, user.id);

  return NextResponse.json({
    conversation: formatConversationResponse(resolved),
  });
}

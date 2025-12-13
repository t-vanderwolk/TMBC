import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUserOrThrow } from "@/lib/auth/getUser";
import { formatConversationResponse } from "@/lib/chat/formatters";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);

    const conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: { id: user.id },
        },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { conversation: null, messages: [] },
        { status: 200 },
      );
    }

    return NextResponse.json({
      conversation: formatConversationResponse(conversation),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Unable to resolve conversation." },
      { status: 500 },
    );
  }
}

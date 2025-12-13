import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

import { getUserOrThrow } from "@/lib/auth/getUser";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);

  if (user.role !== Role.MENTOR) {
    return NextResponse.json({ error: "Mentor role required." }, { status: 403 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { id: user.id },
      },
    },
    include: {
      participants: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const summary = conversations.map((conversation) => {
    const mentor = conversation.participants.find((participant) => participant.role === Role.MENTOR);
    const member = conversation.participants.find((participant) => participant.role === Role.MEMBER);
    const lastMessage = conversation.messages[0];

    return {
      threadId: conversation.id,
      mentorId: mentor?.id ?? "",
      memberId: member?.id ?? "",
      lastMessage: lastMessage?.content ?? "",
      updatedAt: conversation.updatedAt.toISOString(),
    };
  });

  return NextResponse.json(summary);
}

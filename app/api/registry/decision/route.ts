import { NextResponse } from "next/server";
import { RegistryDecisionStatus, RegistryItemStatus } from "@prisma/client";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

// TMBC Canon:
// The Plan is a mentor-led registry builder.
// Registry items are proposed manually and decided by members.
// No automatic suggestions, no prices, no affiliate CTAs.
// Learn and Workbook inform decisions but never mutate the registry.

export async function POST(request: Request) {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "MEMBER") {
      return NextResponse.json({ error: "Only members can update Plan decisions." }, { status: 403 });
    }

    const payload = (await request.json()) as {
      itemId?: string;
      decision?: "accept" | "defer";
    };

    if (!payload.itemId || !payload.decision) {
      return NextResponse.json({ error: "itemId and decision are required." }, { status: 400 });
    }

    const item = await prisma.registryItem.findFirst({
      where: { id: payload.itemId, userId: user.id },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Registry item not found." }, { status: 404 });
    }

    if (payload.decision === "accept") {
      await prisma.registryItem.update({
        where: { id: payload.itemId },
        data: {
          decisionStatus: RegistryDecisionStatus.ACCEPTED,
          status: RegistryItemStatus.ADDED,
        },
      });
    }

    if (payload.decision === "defer") {
      await prisma.registryItem.update({
        where: { id: payload.itemId },
        data: {
          decisionStatus: null,
          status: RegistryItemStatus.REMOVED,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update decision.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

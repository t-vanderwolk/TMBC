import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { recordCompareDecision } from "@/lib/services/server/registryCompare.service";

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to save compare decision.";
  return NextResponse.json({ error: message }, { status: 400 });
};

export async function POST(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== "MEMBER") {
      return NextResponse.json({ error: "Only members can record compare decisions." }, { status: 403 });
    }
    const payload = (await request.json()) as {
      itemIds?: string[];
      decision?: string;
      source?: string;
      acceptedItemId?: string | null;
      acceptedSuggestionId?: string | null;
    };
    const itemIds = Array.isArray(payload?.itemIds) ? payload.itemIds.filter(Boolean) : [];
    const uniqueIds = Array.from(new Set(itemIds));
    if (!uniqueIds.length) {
      return NextResponse.json({ error: "Compare items are required." }, { status: 400 });
    }
    if (!payload?.decision) {
      return NextResponse.json({ error: "Decision is required." }, { status: 400 });
    }

    const result = await recordCompareDecision({
      userId: user.id,
      itemIds: uniqueIds,
      decision: payload.decision as any,
      source: payload?.source as any,
      acceptedItemId: payload?.acceptedItemId ?? null,
      acceptedSuggestionId: payload?.acceptedSuggestionId ?? null,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

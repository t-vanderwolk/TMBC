import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { acceptMentorProductSuggestion } from "@/lib/services/server/registry.service";

export async function POST(
  _request: Request,
  { params }: { params: { suggestionId?: string } },
) {
  const suggestionId = params?.suggestionId;
  if (!suggestionId) {
    return NextResponse.json({ error: "Suggestion id is required." }, { status: 400 });
  }

  const user = await getUserOrThrow();
  if (user.role !== "MEMBER") {
    return NextResponse.json({ error: "Only members can accept suggestions." }, { status: 403 });
  }

  try {
    const item = await acceptMentorProductSuggestion(user.id, suggestionId);
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to accept suggestion.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

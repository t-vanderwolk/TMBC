import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { resolveMentorSuggestionOutboundLink } from "@/lib/services/server/registry.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { suggestionId?: string } },
) {
  const suggestionId = params?.suggestionId;
  if (!suggestionId) {
    return NextResponse.json({ error: "Suggestion id is required." }, { status: 400 });
  }

  const user = await getUserOrThrow();
  if (user.role !== "MEMBER") {
    return NextResponse.json({ error: "Only members can open suggestion links." }, { status: 403 });
  }

  try {
    const { url } = await resolveMentorSuggestionOutboundLink(user.id, suggestionId);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to open suggestion link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

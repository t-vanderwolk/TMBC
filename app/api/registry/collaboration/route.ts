import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { getRegistryCollaborationState } from "@/lib/services/server/registryCollaboration.service";

const requireMember = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MEMBER") {
    throw new Error("Only members can access collaboration settings.");
  }
  return user;
};

const emptyState = () => ({
  mentor: null,
  collaboration: {
    requestedAt: null,
    confirmedAt: null,
    mentorEmail: null,
  },
  canCollaborate: false,
  guidedInviteUrl: null,
  instructions: [],
});

const handleError = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unable to load collaboration settings.";
  const status = message.includes("Only members") ? 403 : 200;
  // GET /api/registry/collaboration must never hard-fail the registry page.
  return NextResponse.json(status === 403 ? { error: message } : emptyState(), { status });
};

export async function GET() {
  try {
    const user = await requireMember();
    const state = await getRegistryCollaborationState(user.id);
    return NextResponse.json(state);
  } catch (error) {
    return handleError(error);
  }
}

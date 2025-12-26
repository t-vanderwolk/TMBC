import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { confirmRegistryCollaboration } from "@/lib/services/server/registryCollaboration.service";

const requireMember = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MEMBER") {
    throw new Error("Only members can confirm collaboration.");
  }
  return user;
};

const handleError = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unable to confirm collaboration.";
  const status = message.includes("Only members") ? 403 : 400;
  return NextResponse.json({ error: message }, { status });
};

export async function POST() {
  try {
    const user = await requireMember();
    const state = await confirmRegistryCollaboration(user.id);
    return NextResponse.json(state);
  } catch (error) {
    return handleError(error);
  }
}

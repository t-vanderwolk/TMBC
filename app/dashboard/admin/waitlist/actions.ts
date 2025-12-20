"use server";

import { revalidatePath } from "next/cache";

import { approveInviteRequest, rejectInviteRequest } from "@/lib/services/server/inviteRequest.service";
import { getUserOrThrow } from "@/lib/auth/getUser";

const WAITLIST_PATH = "/dashboard/admin/waitlist";

const requireAdmin = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
};

export async function approveWaitlistEntry(formData: FormData) {
  const user = await requireAdmin();
  const requestId = formData.get("requestId")?.toString();
  if (!requestId) {
    throw new Error("Request id is required");
  }
  await approveInviteRequest(requestId, user.id);
  revalidatePath(WAITLIST_PATH);
}

export async function rejectWaitlistEntry(formData: FormData) {
  await requireAdmin();
  const requestId = formData.get("requestId")?.toString();
  if (!requestId) {
    throw new Error("Request id is required");
  }
  await rejectInviteRequest(requestId);
  revalidatePath(WAITLIST_PATH);
}

"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@/types/role";

import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  generateInvite,
  revokeInvite,
} from "@/lib/services/server/invite.service";
import { updateAdminUser } from "@/lib/services/server/admin.service";

const DASHBOARD_PATH = "/dashboard/admin";

const requireAdmin = (user: { role: Role }) => {
  if (user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
};

// Coerce the provided max uses into a positive integer, defaulting to single-use invites.
const sanitizeNumber = (value: FormDataEntryValue | null, fallback: number) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
};

export async function createAdminInvite(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const role = (formData.get("role")?.toString() ?? "member").toLowerCase();
  const email = formData.get("email")?.toString().trim() || undefined;
  const maxUses = sanitizeNumber(formData.get("maxUses"), 1);

  const invite = await generateInvite({
    creatorId: user.id,
    role,
    email,
    maxUses,
  });

  console.info(
    `[Admin Action] ${user.email} created invite ${invite.code} ${email ? `for ${email}` : "open"}`,
  );

  revalidatePath(DASHBOARD_PATH);
  return invite;
}

export async function revokeAdminInvite(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const code = formData.get("code")?.toString().trim();
  if (!code) {
    throw new Error("Invite code is required");
  }

  const invite = await revokeInvite(code);

  console.info(`[Admin Action] ${user.email} revoked invite ${invite.code}`);
  revalidatePath(DASHBOARD_PATH);
  return invite;
}

export async function updateUserStatus(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const userId = formData.get("userId")?.toString();
  const status = (formData.get("status")?.toString() ?? "").toLowerCase();
  if (!userId || !["active", "disabled"].includes(status)) {
    throw new Error("Valid user id and status are required");
  }

  await updateAdminUser(userId, { status: status as "active" | "disabled" });
  console.info(`[Admin Action] ${user.email} set status ${status} for user ${userId}`);
  revalidatePath(DASHBOARD_PATH);
}

export async function updateUserRole(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const userId = formData.get("userId")?.toString();
  const role = (formData.get("role")?.toString() ?? "").toLowerCase();
  if (!userId || !["member", "mentor", "admin"].includes(role)) {
    throw new Error("Valid user id and role are required");
  }

  await updateAdminUser(userId, { role: role as "member" | "mentor" | "admin" });
  console.info(`[Admin Action] ${user.email} set role ${role} for user ${userId}`);
  revalidatePath(DASHBOARD_PATH);
}

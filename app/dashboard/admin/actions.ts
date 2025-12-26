"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

import { getUserOrThrow, type SafeUser } from "@/lib/auth/getUser";
import {
  generateInvite,
  revokeInvite,
} from "@/lib/services/server/invite.service";
import { getOfficialSenderEmail } from "@/lib/utils/server/officialSender";
import {
  createAdminEvent,
  updateAdminEvent,
  updateAdminUser,
} from "@/lib/services/server/admin.service";

const DASHBOARD_PATH = "/dashboard/admin";
const USER_PATH = "/dashboard/admin/users";
const MENTOR_PATH = "/dashboard/admin/mentors";
const EVENT_PATH = "/dashboard/admin/events";

const requireAdmin = (user: SafeUser) => {
  if (user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
};

const revalidateAdmin = (...paths: string[]) => {
  paths.forEach((path) => revalidatePath(path));
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
    `[Admin Action] ${getOfficialSenderEmail()} created invite ${invite.code} ${
      email ? `for ${email}` : "open"
    } (adminId=${user.id})`,
  );

  revalidateAdmin(DASHBOARD_PATH);
  return invite;
}

export async function revokeAdminInvite(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const code = formData.get("code")?.toString().trim();
  if (!code) {
    throw new Error("Invite code is required");
  }

  const invite = await revokeInvite(code);

  console.info(
    `[Admin Action] ${getOfficialSenderEmail()} revoked invite ${invite.code} (adminId=${user.id})`,
  );
  revalidateAdmin(DASHBOARD_PATH);
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
  revalidateAdmin(DASHBOARD_PATH, USER_PATH);
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
  revalidateAdmin(DASHBOARD_PATH, USER_PATH);
}

export async function assignUserMentor(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const userId = formData.get("userId")?.toString();
  const mentorIdRaw = formData.get("mentorId")?.toString();
  if (!userId) {
    throw new Error("User id is required for reassigning mentors");
  }
  const mentorId = mentorIdRaw && mentorIdRaw.length > 0 ? mentorIdRaw : null;

  await updateAdminUser(userId, { mentorId });
  console.info(`[Admin Action] ${user.email} assigned mentor ${mentorId ?? "unassigned"} to user ${userId}`);
  revalidateAdmin(USER_PATH, MENTOR_PATH);
}

export async function createEvent(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const name = formData.get("name")?.toString().trim();
  const date = formData.get("date")?.toString();
  const location = formData.get("location")?.toString().trim();
  const status = formData.get("status")?.toString();

  if (!name || !date) {
    throw new Error("Name and date are required to create an event");
  }

  await createAdminEvent(
    { name, date, location: location || undefined, status: status || "scheduled" },
    user.id,
    user.name ?? undefined,
  );
  console.info(`[Admin Action] ${user.email} created event ${name}`);
  revalidateAdmin(EVENT_PATH, DASHBOARD_PATH);
}

export async function updateEvent(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const eventId = formData.get("eventId")?.toString();
  const name = formData.get("name")?.toString().trim();
  const date = formData.get("date")?.toString();
  const location = formData.get("location")?.toString().trim();
  const status = formData.get("status")?.toString();

  if (!eventId) {
    throw new Error("Event id is required");
  }

  const payload: Record<string, string> = {};
  if (name) payload.name = name;
  if (date) payload.date = date;
  if (location) payload.location = location;
  if (status) payload.status = status;

  await updateAdminEvent(eventId, payload);
  console.info(`[Admin Action] ${user.email} updated event ${eventId}`);
  revalidateAdmin(EVENT_PATH, DASHBOARD_PATH);
}

export async function cancelEvent(formData: FormData) {
  const user = requireAdmin(await getUserOrThrow());
  const eventId = formData.get("eventId")?.toString();
  if (!eventId) {
    throw new Error("Event id is required to cancel");
  }

  await updateAdminEvent(eventId, { status: "cancelled" });
  console.info(`[Admin Action] ${user.email} cancelled event ${eventId}`);
  revalidateAdmin(EVENT_PATH, DASHBOARD_PATH);
}

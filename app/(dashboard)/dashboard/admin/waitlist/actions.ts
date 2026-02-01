"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

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
  await requireAdmin();
  const requestId = formData.get("requestId")?.toString();
  if (!requestId) {
    throw new Error("Request id is required");
  }

  const headerList = headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  if (!host) {
    throw new Error("Unable to determine host for approval request");
  }

  const cookieHeader = cookies()
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await fetch(
    `${protocol}://${host}/api/admin/invite-requests/${requestId}/approve`,
    {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      (payload as { error?: string })?.error ?? "Unable to approve invite request";
    throw new Error(message);
  }
  revalidatePath(WAITLIST_PATH);
}

export async function rejectWaitlistEntry(formData: FormData) {
  await requireAdmin();
  const requestId = formData.get("requestId")?.toString();
  if (!requestId) {
    throw new Error("Request id is required");
  }

  const headerList = headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  if (!host) {
    throw new Error("Unable to determine host for rejection request");
  }

  const cookieHeader = cookies()
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await fetch(
    `${protocol}://${host}/api/admin/invite-requests/${requestId}/reject`,
    {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      (payload as { error?: string })?.error ?? "Unable to reject invite request";
    throw new Error(message);
  }
  revalidatePath(WAITLIST_PATH);
}

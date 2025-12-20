"use server";

import { revalidatePath } from "next/cache";

import { getAdminMentors, getAdminSettings, updateAdminSettings } from "@/lib/services/server/admin.service";
import { getUserOrThrow } from "@/lib/auth/getUser";

const SETTINGS_PATH = "/dashboard/admin/settings";

const requireAdmin = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
};

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const inviteOnly = formData.get("inviteOnly") === "true";
  const defaultMentorId = formData.get("defaultMentorId")?.toString() || undefined;

  await updateAdminSettings({
    inviteOnly,
    defaultMentorId: defaultMentorId || undefined,
  });
  revalidatePath(SETTINGS_PATH);
}

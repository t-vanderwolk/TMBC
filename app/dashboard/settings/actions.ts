"use server";

import fs from "fs/promises";
import path from "path";

import { revalidatePath } from "next/cache";

import { getUserOrThrow, type SafeUser } from "@/lib/auth/getUser";
import {
  HouseholdPayload,
  refreshMemberRecommendations,
  saveProfileImagePath,
  updateMemberHousehold,
  updateMemberProfile,
} from "@/lib/services/server/memberSettings.service";

const SETTINGS_PATH = "/dashboard/settings";

const requireMember = (user: SafeUser) => {
  if (user.role !== "MEMBER") {
    throw new Error("Unauthorized");
  }
  return user;
};

export async function updateProfileInfo(formData: FormData) {
  const user = requireMember(await getUserOrThrow());
  const firstName = formData.get("firstName")?.toString().trim() || undefined;
  const lastName = formData.get("lastName")?.toString().trim() || undefined;
  const email = formData.get("email")?.toString().trim();
  if (!email) {
    throw new Error("Email is required");
  }

  await updateMemberProfile(user.id, { firstName, lastName, email });
  revalidatePath(SETTINGS_PATH);
}

export async function updateHouseholdDetails(formData: FormData) {
  const user = requireMember(await getUserOrThrow());
  const normalize = (value: FormDataEntryValue | null) => {
    const text = value?.toString().trim();
    return text?.length ? text : undefined;
  };
  const payload: HouseholdPayload = {
    partnerName: normalize(formData.get("partnerName")),
    partnerHeight: normalize(formData.get("partnerHeight")),
    primaryCaregiver: normalize(formData.get("primaryCaregiver")),
    secondaryCaregiver: normalize(formData.get("secondaryCaregiver")),
    petsAtHome: formData.get("petsAtHome") === "true",
    petDetails: normalize(formData.get("petDetails")),
  };

  await updateMemberHousehold(user.id, payload);
  revalidatePath(SETTINGS_PATH);
}

export async function regenerateRecommendations() {
  const user = requireMember(await getUserOrThrow());
  const result = await refreshMemberRecommendations(user.id);
  revalidatePath(SETTINGS_PATH);
  return {
    message: `Recommendations updated. ${result.diff.added} new category${result.diff.added === 1 ? "" : "ies"}, ${result.diff.removed} removed.`,
  };
}

const PROFILE_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "profiles");

const sanitizeExtension = (name: string) => {
  const extension = path.extname(name).toLowerCase();
  if (!extension) return ".png";
  return extension.replace(/[^a-z0-9.]/g, "") || ".png";
};

export async function uploadProfileImage(formData: FormData) {
  const user = requireMember(await getUserOrThrow());
  const file = formData.get("image");
  if (!(file instanceof File)) {
    throw new Error("Image file is required");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(PROFILE_UPLOAD_DIR, { recursive: true });
  const extension = sanitizeExtension(file.name);
  const filename = `${user.id}${extension}`;
  const destination = path.join(PROFILE_UPLOAD_DIR, filename);
  await fs.writeFile(destination, buffer);

  const imageUrl = `/uploads/profiles/${filename}`;
  await saveProfileImagePath(user.id, imageUrl);
  revalidatePath(SETTINGS_PATH);
  return imageUrl;
}

import type { Prisma, PartnerRoleLabel } from "@prisma/client";
import { saveProfile } from "@/lib/services/server/onboarding.service";
import {
  getOnboardingProfile,
} from "@/lib/services/server/onboarding.service";
import { prisma } from "@/lib/prisma";

/* ─────────────────────────── Types ─────────────────────────── */

export type HouseholdPayload = {
  partnerName?: string;
  partnerHeight?: string;
  primaryCaregiver?: string;
  secondaryCaregiver?: string;
  petsAtHome?: boolean;
  petDetails?: string;
};

export type ProfileUpdatePayload = {
  firstName?: string;
  lastName?: string;
  email: string;
};

export type MemberDetailsPayload = {
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  city?: string;
  state?: string;
  dueDate?: string;
  location?: string;
};

export type PartnerProfilePayload = {
  name?: string;
  roleLabel?: PartnerRoleLabel | null;
  notes?: string;
};

/* ─────────────────────── Utilities ───────────────────────── */
const EMPTY_RECOMMENDATIONS = { tags: [], categories: [] };

const baseProfileSelect = {
  id: true,
  userId: true,
  city: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  firstName: true,
  lastName: true,
  preferredName: true,
  state: true,
  inviteRequestId: true,
} satisfies Prisma.ProfileSelect;

const partnerProfileSelect = {
  id: true,
  userId: true,
  name: true,
  roleLabel: true,
  notes: true,
  updatedAt: true,
  createdAt: true,
} satisfies Prisma.PartnerProfileSelect;

/**
 * Detects Prisma "missing column" errors (P2021) safely
 * without relying on instanceof checks.
 */
const isMissingColumnError = (error: any, column: string) =>
  error?.code === "P2021" &&
  typeof error?.meta?.column_name === "string" &&
  error.meta.column_name === column;

/* ─────────────────── Member Settings ───────────────────── */

export const getMemberSettingsData = async (userId: string) => {
  let profile = null;

  try {
    profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        ...baseProfileSelect,
        imageUrl: true,
      },
    });
  } catch (error) {
    if (isMissingColumnError(error, "imageUrl")) {
      const fallback = await prisma.profile.findUnique({
        where: { userId },
        select: baseProfileSelect,
      });

      profile = fallback
        ? { ...fallback, imageUrl: null }
        : null;
    } else {
      throw error;
    }
  }

  const onboardingProfile = await getOnboardingProfile(userId);

  return {
    profile,
    onboardingProfile,
    partnerProfile: await getPartnerProfile(userId),
  };
};

/* ─────────────────── Profile Updates ───────────────────── */

export const updateMemberProfile = async (
  userId: string,
  payload: ProfileUpdatePayload,
) => {
  if (!payload.email) {
    throw new Error("Email is required");
  }

  const existingEmail = await prisma.user.findFirst({
    where: {
      email: payload.email,
      NOT: { id: userId },
    },
  });

  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const userUpdate = prisma.user.update({
    where: { id: userId },
    data: {
      email: payload.email,
      name: [payload.firstName, payload.lastName]
        .filter(Boolean)
        .join(" ") || undefined,
    },
  });

  const profileUpdate = prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      firstName: payload.firstName ?? null,
      lastName: payload.lastName ?? null,
    },
    update: {
      firstName: payload.firstName ?? undefined,
      lastName: payload.lastName ?? undefined,
    },
  });

  await prisma.$transaction([userUpdate, profileUpdate]);
};

export const saveMemberDetails = async (userId: string, payload: MemberDetailsPayload) => {
  const nameParts = [payload.firstName, payload.lastName].filter(Boolean);
  const userName = nameParts.length ? nameParts.join(" ") : undefined;
  const dueDateValue = payload.dueDate ? new Date(payload.dueDate) : undefined;

  const profileUpsert = prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      firstName: payload.firstName ?? null,
      lastName: payload.lastName ?? null,
      preferredName: payload.preferredName ?? null,
      city: payload.city ?? null,
      state: payload.state ?? null,
      dueDate: dueDateValue,
    },
    update: {
      firstName: payload.firstName ?? undefined,
      lastName: payload.lastName ?? undefined,
      preferredName: payload.preferredName ?? undefined,
      city: payload.city ?? undefined,
      state: payload.state ?? undefined,
      dueDate: dueDateValue ?? undefined,
    },
  });

  await saveProfile({
    userId,
    name: userName,
    dueDate: payload.dueDate,
    location: payload.location,
  });
  await profileUpsert;
};

export const getPartnerProfile = async (userId: string) => {
  return prisma.partnerProfile.findUnique({
    where: { userId },
    select: partnerProfileSelect,
  });
};

export const updatePartnerProfile = async (
  userId: string,
  payload: PartnerProfilePayload,
) => {
  await prisma.partnerProfile.upsert({
    where: { userId },
    create: {
      userId,
      name: payload.name ?? null,
      roleLabel: payload.roleLabel ?? null,
      notes: payload.notes ?? null,
    },
    update: {
      name: payload.name ?? null,
      roleLabel: payload.roleLabel ?? null,
      notes: payload.notes ?? null,
    },
  });
};

/* ─────────────── Onboarding Context Updates ─────────────── */

const saveOnboardingAnswers = async (
  userId: string,
  answers: Record<string, unknown>,
  status = "member-settings",
) => {
  const formattedAnswers = answers as Prisma.InputJsonValue;

  await prisma.onboardingProfile.upsert({
    where: { userId },
    create: {
      userId,
      answers: formattedAnswers,
      recommendations: EMPTY_RECOMMENDATIONS as Prisma.InputJsonValue,
      status,
    },
    update: {
      answers: formattedAnswers,
      recommendations: EMPTY_RECOMMENDATIONS as Prisma.InputJsonValue,
      status,
    },
  });
};

export const updateMemberHousehold = async (
  userId: string,
  payload: HouseholdPayload,
) => {
  const onboardingProfile = await getOnboardingProfile(userId);
  const existingAnswers =
    (onboardingProfile?.answers as Record<string, unknown>) ?? {};
  const existingHousehold =
    (existingAnswers.household as Record<string, unknown>) ?? {};

  const updatedHousehold = {
    ...existingHousehold,
    partnerName: payload.partnerName ?? existingHousehold.partnerName ?? null,
    partnerHeight:
      payload.partnerHeight ?? existingHousehold.partnerHeight ?? null,
    primaryCaregiver:
      payload.primaryCaregiver ??
      existingHousehold.primaryCaregiver ??
      null,
    secondaryCaregiver:
      payload.secondaryCaregiver ??
      existingHousehold.secondaryCaregiver ??
      null,
    petsAtHome: payload.petsAtHome ?? existingHousehold.petsAtHome ?? false,
    petDetails: payload.petDetails ?? existingHousehold.petDetails ?? null,
  };

  const mergedAnswers = {
    ...existingAnswers,
    household: updatedHousehold,
  };

  await saveOnboardingAnswers(userId, mergedAnswers, "household-update");
};

/* ─────────────── Profile Image Handling ─────────────── */

// INTENTIONAL: Keep the profile field camelCase (`imageUrl`) and avoid alternate casing.
export const saveProfileImagePath = async (
  userId: string,
  imageUrl: string,
) => {
  await prisma.profile
    .upsert({
      where: { userId },
      create: { userId, imageUrl },
      update: { imageUrl },
    })
    .catch((error) => {
      if (isMissingColumnError(error, "imageUrl")) {
        return;
      }
      throw error;
    });
};

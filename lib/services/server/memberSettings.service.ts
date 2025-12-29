import type { Prisma } from "@prisma/client";
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
  state: true,
  inviteRequestId: true,
} satisfies Prisma.ProfileSelect;

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

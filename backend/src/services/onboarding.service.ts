import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { RecommendationsResult } from '../utils/recommendations';

export type UpsertOnboardingPayload = {
  answers: Prisma.InputJsonValue;
  recommendations: Prisma.InputJsonValue;
  status: string;
};

export const upsertOnboardingProfile = async (userId: string, payload: UpsertOnboardingPayload) => {
  return prisma.onboardingProfile.upsert({
    where: { userId },
    create: {
      userId,
      answers: payload.answers,
      recommendations: payload.recommendations,
      status: payload.status,
    },
    update: {
      answers: payload.answers,
      recommendations: payload.recommendations,
      status: payload.status,
    },
  });
};

export const getOnboardingProfile = async (userId: string) => {
  return prisma.onboardingProfile.findUnique({
    where: { userId },
  });
};

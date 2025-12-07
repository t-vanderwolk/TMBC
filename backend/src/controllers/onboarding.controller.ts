import { Request, Response } from 'express';

import { Prisma } from '@prisma/client';
import { getOnboardingProfile, upsertOnboardingProfile } from '../services/onboarding.service';
import { generateRecommendations, OnboardingAnswers } from '../utils/recommendations';

const getUserId = (req: Request) => (req as any).user?.id as string | undefined;

const determineStatus = (answers: OnboardingAnswers) => {
  const hasAnswers = Object.values(answers).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return true;
    }
    return Boolean(value);
  });

  return hasAnswers ? 'completed' : 'in_progress';
};

export const saveOnboardingProfileController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const answers = (req.body?.answers ?? {}) as OnboardingAnswers;
  const recommendations = generateRecommendations(answers);
  const status = determineStatus(answers);

  const onboardingProfile = await upsertOnboardingProfile(userId, {
    answers: answers as Prisma.InputJsonValue,
    recommendations: recommendations as Prisma.InputJsonValue,
    status,
  });

  res.json({ onboardingProfile });
};

export const getOnboardingProfileController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const onboardingProfile = await getOnboardingProfile(userId);
  res.json({ onboardingProfile });
};

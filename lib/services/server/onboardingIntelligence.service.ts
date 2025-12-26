import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { generateLifestyleTags } from '@/lib/services/onboarding.service';
import { emitRegistryAnalytics } from './analytics.service';
import { QUESTIONNAIRE_SCHEMA, type QuestionnaireSchema } from '@/lib/onboarding/questionnaireSchema';
import {
  questionnaireSourceValues,
  questionnaireStatusValues,
  type QuestionnaireSourceValue,
  type QuestionnaireStatusValue,
} from '@/lib/types/questionnaire';
import {
  buildLifestyleSnapshot,
  type LifestyleSnapshot,
} from '@/lib/onboarding/lifestyleSnapshot';

type QuestionnaireRecord = {
  id: string;
  version: number;
  status: QuestionnaireStatusValue;
  source: QuestionnaireSourceValue;
  tags: string[];
  answers: Record<string, unknown>;
  registrySnapshot: null;
  lifestyleSnapshot: LifestyleSnapshot | null;
  mentorId: string | null;
};

type QuestionnaireResult = {
  questionnaire: QuestionnaireRecord;
};

type OnboardingProfileWithUser = Prisma.OnboardingProfileGetPayload<{
  include: {
    user: {
      select: { mentorId: true };
    };
  };
}>;

const DEFAULT_SOURCE: QuestionnaireSourceValue = 'INITIAL';
const DEFAULT_STATUS: QuestionnaireStatusValue = 'DRAFT';
const DEFAULT_VERSION = 1;

const normalizeStatus = (value?: string): QuestionnaireStatusValue =>
  value && questionnaireStatusValues.includes(value as QuestionnaireStatusValue)
    ? (value as QuestionnaireStatusValue)
    : DEFAULT_STATUS;

const normalizeSource = (value?: string): QuestionnaireSourceValue =>
  value && questionnaireSourceValues.includes(value as QuestionnaireSourceValue)
    ? (value as QuestionnaireSourceValue)
    : DEFAULT_SOURCE;

const convertSnapshot = (value: Prisma.JsonValue | null | undefined): LifestyleSnapshot | null => {
  if (!value || typeof value !== "object") {
    return null;
  }
  return value as LifestyleSnapshot;
};

const convertAnswers = (value: Prisma.JsonValue | null | undefined): Record<string, unknown> => {
  if (!value || typeof value !== 'object') {
    return {};
  }
  return value as Record<string, unknown>;
};

const hydrateQuestionnaire = (
  profile: OnboardingProfileWithUser,
  source: QuestionnaireSourceValue,
  tags: string[],
  version: number,
): QuestionnaireRecord => ({
  id: profile.id,
  version,
  status: normalizeStatus(profile.status ?? DEFAULT_STATUS),
  source: normalizeSource(source),
  tags,
  answers: convertAnswers(profile.answers),
  registrySnapshot: null,
  lifestyleSnapshot: convertSnapshot(profile.lifestyleSnapshot),
  mentorId: profile.user?.mentorId ?? null,
});

const computeTagsFromAnswers = (answers: Record<string, unknown>) => generateLifestyleTags(answers);
const computeSnapshotFromAnswers = (answers: Record<string, unknown>) => buildLifestyleSnapshot(answers);

const logQuestionnaireAnalytics = (
  userId: string,
  version: number,
  tags: string[],
  status: QuestionnaireStatusValue,
) => {
  emitRegistryAnalytics('questionnaire_saved', {
    userId,
    version,
    tags,
    status,
  });
};
const EMPTY_RECOMMENDATIONS = { tags: [], categories: [] };

export const OnboardingIntelligenceService = {
  schema: QUESTIONNAIRE_SCHEMA,

  async getLatestQuestionnaire(userId: string): Promise<QuestionnaireRecord | null> {
    const profile = await prisma.onboardingProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { mentorId: true } },
      },
    });
    if (!profile) {
      return null;
    }
    const answers = convertAnswers(profile.answers);
    const tags = computeTagsFromAnswers(answers);
    const lifestyleSnapshot = convertSnapshot(profile.lifestyleSnapshot) ?? computeSnapshotFromAnswers(answers);
    return {
      ...hydrateQuestionnaire(profile, DEFAULT_SOURCE, tags, DEFAULT_VERSION),
      lifestyleSnapshot,
    };
  },

  computeTagsFromAnswers,

  emitAnalyticsEvents: logQuestionnaireAnalytics,

  async createInitialQuestionnaire(options: CreateQuestionnaireOptions): Promise<QuestionnaireResult> {
    const { userId, answers, source, status = DEFAULT_STATUS } = options;
    const normalizedSource = normalizeSource(source);
    const normalizedAnswers = answers as Prisma.InputJsonValue;
    const tags = computeTagsFromAnswers(answers);
    const lifestyleSnapshot = computeSnapshotFromAnswers(answers);
    const profile = await prisma.onboardingProfile.upsert({
      where: { userId },
      create: {
        userId,
        answers: normalizedAnswers,
        recommendations: EMPTY_RECOMMENDATIONS as Prisma.InputJsonValue,
        lifestyleSnapshot: lifestyleSnapshot as Prisma.InputJsonValue,
        status,
      },
      update: {
        answers: normalizedAnswers,
        recommendations: EMPTY_RECOMMENDATIONS as Prisma.InputJsonValue,
        lifestyleSnapshot: lifestyleSnapshot as Prisma.InputJsonValue,
        status,
      },
      include: {
        user: { select: { mentorId: true } },
      },
    });

    logQuestionnaireAnalytics(userId, DEFAULT_VERSION, tags, status);

    return {
      questionnaire: hydrateQuestionnaire(profile, normalizedSource, tags, DEFAULT_VERSION),
    };
  },

  async saveQuestionnaireRevision(options: SaveQuestionnaireRevisionOptions): Promise<QuestionnaireResult> {
    const { userId, answers, source, status = DEFAULT_STATUS } = options;
    const normalizedSource = normalizeSource(source);
    const existing = await prisma.onboardingProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { mentorId: true } },
      },
    });
    if (!existing) {
      throw new Error('Questionnaire not found');
    }
    const normalizedAnswers = answers as Prisma.InputJsonValue;
    const tags = computeTagsFromAnswers(answers);
    const lifestyleSnapshot = computeSnapshotFromAnswers(answers);
    const profile = await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        answers: normalizedAnswers,
        recommendations: EMPTY_RECOMMENDATIONS as Prisma.InputJsonValue,
        lifestyleSnapshot: lifestyleSnapshot as Prisma.InputJsonValue,
        status,
      },
      include: {
        user: { select: { mentorId: true } },
      },
    });

    logQuestionnaireAnalytics(userId, DEFAULT_VERSION, tags, status);

    return {
      questionnaire: hydrateQuestionnaire(profile, normalizedSource, tags, DEFAULT_VERSION),
    };
  },

  getSchema(): QuestionnaireSchema {
    return QUESTIONNAIRE_SCHEMA;
  },
};

type CreateQuestionnaireOptions = {
  userId: string;
  mentorId?: string | null;
  answers: Record<string, unknown>;
  source?: QuestionnaireSourceValue;
  status?: QuestionnaireStatusValue;
};

type SaveQuestionnaireRevisionOptions = {
  userId: string;
  answers: Record<string, unknown>;
  source?: QuestionnaireSourceValue;
  status?: QuestionnaireStatusValue;
};

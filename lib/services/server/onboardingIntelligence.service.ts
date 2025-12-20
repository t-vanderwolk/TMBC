import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { generateLifestyleTags } from '@/lib/services/onboarding.service';
import {
  buildCuratedRegistry,
  type CuratedRegistry,
} from '@/lib/registry/recommendations';
import { emitRegistryAnalytics } from './analytics.service';
import { QUESTIONNAIRE_SCHEMA, type QuestionnaireSchema } from '@/lib/onboarding/questionnaireSchema';
import {
  questionnaireSourceValues,
  questionnaireStatusValues,
  type QuestionnaireSourceValue,
  type QuestionnaireStatusValue,
} from '@/lib/types/questionnaire';

type QuestionnaireRecord = {
  id: string;
  version: number;
  status: QuestionnaireStatusValue;
  source: QuestionnaireSourceValue;
  tags: string[];
  answers: Record<string, unknown>;
  registrySnapshot: CuratedRegistry | null;
  mentorId: string | null;
};

type QuestionnaireResult = {
  questionnaire: QuestionnaireRecord;
  recommendations: CuratedRegistry;
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

const convertRecommendations = (value: Prisma.JsonValue | null | undefined): CuratedRegistry | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }
  return value as CuratedRegistry;
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
  recommendations: CuratedRegistry,
  version: number,
): QuestionnaireRecord => ({
  id: profile.id,
  version,
  status: normalizeStatus(profile.status ?? DEFAULT_STATUS),
  source: normalizeSource(source),
  tags,
  answers: convertAnswers(profile.answers),
  registrySnapshot: recommendations,
  mentorId: profile.user?.mentorId ?? null,
});

const computeTagsFromAnswers = (answers: Record<string, unknown>) => generateLifestyleTags(answers);

const buildCuratedRecommendations = (tags: string[]) => buildCuratedRegistry(tags);

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

const applyRegistryRerankHelper = async (userId: string, tags: string[]) => {
  const registry = await prisma.registry.findUnique({
    where: { userId },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          status: true,
        },
        take: 1,
      },
    },
  });
  const curated = await buildCuratedRecommendations(tags);
  return {
    registryId: registry?.id ?? null,
    hasItems: Boolean(registry?.items.length),
    curated,
  };
};

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
    const storedRecommendations = convertRecommendations(profile.recommendations);
    const recommendations = storedRecommendations ?? (await buildCuratedRecommendations(tags));
    return hydrateQuestionnaire(profile, DEFAULT_SOURCE, tags, recommendations, DEFAULT_VERSION);
  },

  computeTagsFromAnswers,

  async buildRecommendations(tags: string[]): Promise<CuratedRegistry> {
    return buildCuratedRecommendations(tags);
  },

  applyRegistryRerank: applyRegistryRerankHelper,

  emitAnalyticsEvents: logQuestionnaireAnalytics,

  async createInitialQuestionnaire(options: CreateQuestionnaireOptions): Promise<QuestionnaireResult> {
    const { userId, answers, source, status = DEFAULT_STATUS } = options;
    const normalizedSource = normalizeSource(source);
    const normalizedAnswers = answers as Prisma.InputJsonValue;
    const tags = computeTagsFromAnswers(answers);
    const recommendations = await buildCuratedRecommendations(tags);
    const profile = await prisma.onboardingProfile.upsert({
      where: { userId },
      create: {
        userId,
        answers: normalizedAnswers,
        recommendations: recommendations as Prisma.InputJsonValue,
        status,
      },
      update: {
        answers: normalizedAnswers,
        recommendations: recommendations as Prisma.InputJsonValue,
        status,
      },
      include: {
        user: { select: { mentorId: true } },
      },
    });

    logQuestionnaireAnalytics(userId, DEFAULT_VERSION, tags, status);
    void applyRegistryRerankHelper(userId, tags);

    return {
      questionnaire: hydrateQuestionnaire(profile, normalizedSource, tags, recommendations, DEFAULT_VERSION),
      recommendations,
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
    const recommendations = await buildCuratedRecommendations(tags);
    const profile = await prisma.onboardingProfile.update({
      where: { userId },
      data: {
        answers: normalizedAnswers,
        recommendations: recommendations as Prisma.InputJsonValue,
        status,
      },
      include: {
        user: { select: { mentorId: true } },
      },
    });

    logQuestionnaireAnalytics(userId, DEFAULT_VERSION, tags, status);
    void applyRegistryRerankHelper(userId, tags);

    return {
      questionnaire: hydrateQuestionnaire(profile, normalizedSource, tags, recommendations, DEFAULT_VERSION),
      recommendations,
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

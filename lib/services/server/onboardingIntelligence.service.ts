import type { Prisma } from '@prisma/client';
import {
  QuestionnaireSource,
  QuestionnaireStatus,
} from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { generateLifestyleTags } from '@/lib/services/onboarding.service';
import {
  buildCuratedRegistry,
  CuratedRegistry,
} from '@/lib/registry/recommendations';
import { emitRegistryAnalytics } from './analytics.service';
import { QUESTIONNAIRE_SCHEMA, type QuestionnaireSchema } from '@/lib/onboarding/questionnaireSchema';

export type OnboardingAnswers = Record<string, unknown>;

type QuestionnaireResult = {
  questionnaire: Prisma.OnboardingQuestionnaireGetPayload<{
    include: {
      revisions: true;
    };
  }>;
  recommendations: CuratedRegistry;
};

type CreateQuestionnaireOptions = {
  userId: string;
  mentorId?: string | null;
  answers: OnboardingAnswers;
  source?: QuestionnaireSource;
  status?: QuestionnaireStatus;
};

type SaveQuestionnaireRevisionOptions = {
  userId: string;
  answers: OnboardingAnswers;
  source?: QuestionnaireSource;
  status?: QuestionnaireStatus;
};

export const OnboardingIntelligenceService = {
  schema: QUESTIONNAIRE_SCHEMA,

  async getLatestQuestionnaire(userId: string) {
    return prisma.onboardingQuestionnaire.findFirst({
      where: { userId },
      orderBy: { version: 'desc' },
      include: {
        revisions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  computeTagsFromAnswers(answers: OnboardingAnswers) {
    return generateLifestyleTags(answers);
  },

  buildRecommendations(tags: string[]) {
    return buildCuratedRegistry(tags);
  },

  async applyRegistryRerank(userId: string, tags: string[]) {
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
    const curated = OnboardingIntelligenceService.buildRecommendations(tags);
    return {
      registryId: registry?.id ?? null,
      hasItems: Boolean(registry?.items.length),
      curated,
    };
  },

  emitAnalyticsEvents(userId: string, version: number, tags: string[], status: QuestionnaireStatus) {
    emitRegistryAnalytics('questionnaire_saved', {
      userId,
      version,
      tags,
      status,
    });
  },

  async createInitialQuestionnaire(options: CreateQuestionnaireOptions): Promise<QuestionnaireResult> {
    const { userId, mentorId, answers, source = QuestionnaireSource.INITIAL, status = QuestionnaireStatus.DRAFT } = options;
    const { _max } = await prisma.onboardingQuestionnaire.aggregate({
      where: { userId },
      _max: { version: true },
    });
    const version = (_max.version ?? 0) + 1;
    const tags = OnboardingIntelligenceService.computeTagsFromAnswers(answers);
    const recommendations = OnboardingIntelligenceService.buildRecommendations(tags);

    const questionnaire = await prisma.$transaction(async (tx) => {
      const created = await tx.onboardingQuestionnaire.create({
        data: {
          userId,
          version,
          status,
          source,
          mentorId,
          tags,
          answers,
          registrySnapshot: recommendations,
        },
        include: {
          revisions: true,
        },
      });
      await tx.onboardingQuestionnaireRevision.create({
        data: {
          questionnaireId: created.id,
          version: 1,
          source,
          answers,
          tags,
        },
      });
      return created;
    });

    await OnboardingIntelligenceService.emitAnalyticsEvents(userId, version, tags, status);
    void OnboardingIntelligenceService.applyRegistryRerank(userId, tags);

    return { questionnaire, recommendations };
  },

  async saveQuestionnaireRevision(options: SaveQuestionnaireRevisionOptions): Promise<QuestionnaireResult> {
    const { userId, answers, source, status } = options;
    const latest = await OnboardingIntelligenceService.getLatestQuestionnaire(userId);
    if (!latest) {
      throw new Error('Questionnaire not found');
    }

    const tags = OnboardingIntelligenceService.computeTagsFromAnswers(answers);
    const recommendations = OnboardingIntelligenceService.buildRecommendations(tags);
    const nextRevisionVersionResult = await prisma.onboardingQuestionnaireRevision.aggregate({
      where: { questionnaireId: latest.id },
      _max: { version: true },
    });
    const nextRevisionVersion = (nextRevisionVersionResult._max.version ?? 0) + 1;
    const updated = await prisma.$transaction(async (tx) => {
      const updatedQuestionnaire = await tx.onboardingQuestionnaire.update({
        where: { id: latest.id },
        data: {
          answers,
          tags,
          registrySnapshot: recommendations,
          status: status ?? latest.status,
          source: source ?? latest.source,
        },
        include: {
          revisions: true,
        },
      });
      await tx.onboardingQuestionnaireRevision.create({
        data: {
          questionnaireId: latest.id,
          version: nextRevisionVersion,
          source: source ?? latest.source,
          answers,
          tags,
        },
      });
      return updatedQuestionnaire;
    });

    await OnboardingIntelligenceService.emitAnalyticsEvents(
      userId,
      updated.version,
      tags,
      status ?? updated.status,
    );
    void OnboardingIntelligenceService.applyRegistryRerank(userId, tags);

    return { questionnaire: updated, recommendations };
  },

  getSchema(): QuestionnaireSchema {
    return QUESTIONNAIRE_SCHEMA;
  },
};

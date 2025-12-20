"use server";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { OnboardingIntelligenceService } from "@/lib/services/server/onboardingIntelligence.service";
import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  questionnaireSourceValues,
  questionnaireStatusValues,
  type QuestionnaireSourceValue,
  type QuestionnaireStatusValue,
} from "@/lib/types/questionnaire";

const questionnairePayloadSchema = z.object({
  answers: z.record(z.string(), z.any()).default({}),
  status: z.enum(questionnaireStatusValues).optional(),
  source: z.enum(questionnaireSourceValues).optional(),
});

const handleError = (error: unknown, message: string) => {
  const payload = error instanceof Error ? { error: error.message } : { error: message };
  return NextResponse.json(payload, { status: 400 });
};

export async function GET() {
  try {
    const user = await getUserOrThrow();
    const questionnaire = await OnboardingIntelligenceService.getLatestQuestionnaire(user.id);

    return NextResponse.json({
      questionnaire: questionnaire
        ? {
            id: questionnaire.id,
            version: questionnaire.version,
            status: questionnaire.status,
            source: questionnaire.source,
            tags: questionnaire.tags,
            answers: questionnaire.answers,
            registrySnapshot: questionnaire.registrySnapshot,
            mentorId: questionnaire.mentorId,
          }
        : null,
      schema: OnboardingIntelligenceService.getSchema(),
    });
  } catch (error) {
    return handleError(error, "Unable to load questionnaire");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserOrThrow();
    const payload = questionnairePayloadSchema.parse(await request.json());
    const source: QuestionnaireSourceValue = payload.source ?? "SETTINGS";
    const status: QuestionnaireStatusValue = payload.status ?? "DRAFT";
    const latest = await OnboardingIntelligenceService.getLatestQuestionnaire(user.id);

    const shouldCreateNewVersion =
      !latest ||
      (source === "SETTINGS" &&
        (latest.source !== "SETTINGS" || latest.status === "COMPLETED"));

    let result;
    if (shouldCreateNewVersion) {
      result = await OnboardingIntelligenceService.createInitialQuestionnaire({
        userId: user.id,
        mentorId: user.mentorId,
        answers: payload.answers,
        source,
        status,
      });
    } else {
      result = await OnboardingIntelligenceService.saveQuestionnaireRevision({
        userId: user.id,
        answers: payload.answers,
        source,
        status,
      });
    }

    return NextResponse.json({
      questionnaire: {
        id: result.questionnaire.id,
        version: result.questionnaire.version,
        status: result.questionnaire.status,
        source: result.questionnaire.source,
        tags: result.questionnaire.tags,
        answers: result.questionnaire.answers,
        registrySnapshot: result.questionnaire.registrySnapshot,
        mentorId: result.questionnaire.mentorId,
      },
      recommendations: result.recommendations,
      schema: OnboardingIntelligenceService.getSchema(),
    });
  } catch (error) {
    return handleError(error, "Unable to save questionnaire");
  }
}

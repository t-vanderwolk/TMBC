import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export type IntakeStepPayload = {
  step: string;
  responses: Record<string, unknown>;
};

export type IntakeSummary = {
  tags: string[];
  completedSteps: string[];
  lastUpdated: string;
};

const flattenAnswerValues = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => flattenAnswerValues(entry));
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap((entry) => flattenAnswerValues(entry));
  }
  if (value == null) return [];
  return [String(value)];
};

export function generateLifestyleTags(responses: Record<string, unknown>) {
  const flattenedValues = Object.values(responses)
    .flatMap((value) => flattenAnswerValues(value))
    .map((value) => value.toLowerCase());

  const valueSet = new Set(flattenedValues);
  const text = flattenedValues.join(" ");
  const suggestions = new Set<string>(["intentional", "calm"]);

  if (valueSet.has("full_flight") || valueSet.has("few") || text.includes("stairs")) {
    suggestions.add("stairs");
    suggestions.add("rugged_terrain");
  }
  if (valueSet.has("apartment") || valueSet.has("condo") || valueSet.has("small")) {
    suggestions.add("low-storage");
    suggestions.add("neutral_aesthetic");
  }
  if (valueSet.has("sedan") || text.includes("travel") || text.includes("city")) {
    suggestions.add("travel_friendly");
  }
  if (valueSet.has("breastfeeding") || valueSet.has("combo") || text.includes("feeding")) {
    suggestions.add("pumping_heavy");
  }
  if (text.includes("soft") || text.includes("wood") || text.includes("calm")) {
    suggestions.add("neutral_aesthetic");
  }
  if (text.includes("outdoor") || text.includes("sunny")) {
    suggestions.add("sunny_routine");
  }

  return Array.from(suggestions);
}

export async function saveIntakeStep(userId: string, payload: IntakeStepPayload) {
  const tags = generateLifestyleTags(payload.responses);
  await prisma.intakeResponse.create({
    data: {
      userId,
      step: payload.step,
      responses: payload.responses as Prisma.JsonObject,
      tags,
    },
  });
  return tags;
}

type IntakeResponseRow = {
  step?: string | null;
  tags: string[];
  createdAt: Date;
};

export async function getIntakeResponses(userId: string): Promise<IntakeResponseRow[]> {
  return prisma.intakeResponse.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function buildOnboardingSummary(userId: string): Promise<IntakeSummary> {
  const responses = await getIntakeResponses(userId);
  const tags = Array.from(new Set(responses.flatMap((row) => row.tags)));
  const completedSteps = responses.map((row) => row.step ?? 'unknown');
  const lastUpdated = responses[responses.length - 1]?.createdAt.toISOString() ?? new Date().toISOString();
  return { tags, completedSteps, lastUpdated };
}

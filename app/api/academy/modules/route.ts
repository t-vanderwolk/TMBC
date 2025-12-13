import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { normalizeModuleContent } from "@/lib/academy/normalizeModuleContent";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const [modules, progressRecords] = await Promise.all([
    prisma.academyModule.findMany(),
    prisma.academyProgress.findMany({
      where: { userId: user.id, completed: true },
    }),
  ]);

  const completedModules = new Set(progressRecords.map((record) => record.moduleId));

  const enriched = modules
    .map((module) => {
      const content = normalizeModuleContent(module.content);
      const metadata = content.metadata ?? {};
      return {
        module,
        content,
        metadata,
        completed: completedModules.has(module.id),
      };
    })
    .sort((a, b) => {
      if (a.module.journey && b.module.journey && a.module.journey !== b.module.journey) {
        return a.module.journey.localeCompare(b.module.journey);
      }
      const orderA = a.metadata.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.metadata.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

  const response = enriched.map(({ module, content, metadata, completed }) => ({
    id: module.id,
    title: module.title,
    description: module.description ?? module.subtitle ?? "",
    journey: module.journey ?? "",
    slug: module.slug ?? module.id,
    objectives: content.objectives ?? [],
    estimatedMinutes: metadata.estimatedTime,
    order: metadata.order,
    isPublished: metadata.isPublished ?? true,
    stage: metadata.stage ?? module.subtitle ?? "Studio ritual",
    completed,
    progress: completed ? 100 : 0,
  }));

  return NextResponse.json({ modules: response });
}

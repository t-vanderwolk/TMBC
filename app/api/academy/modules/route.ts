import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { normalizeModuleContent } from "@/lib/academy/normalizeModuleContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const [modules, progressRecords] = await Promise.all([
    prisma.academyModule.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.academyProgress.findMany({
      where: { userId: user.id, completed: true },
    }),
  ]);

  const completedModuleIds = new Set(progressRecords.map((record) => record.moduleId));

  const response = modules.map((module) => {
    const normalized = normalizeModuleContent(module.content);
    const metadata = normalized.metadata ?? {};
    const completed = completedModuleIds.has(module.id);

    return {
      id: module.id,
      title: module.title,
      description: module.description ?? module.subtitle ?? "",
      journey: module.journey ?? "",
      slug: module.slug ?? module.id,
      objectives: normalized.objectives ?? [],
      estimatedMinutes: metadata.estimatedTime,
      order: module.order ?? metadata.order,
      isPublished: Boolean(module.published ?? metadata.isPublished),
      stage: metadata.stage ?? module.subtitle ?? "Studio ritual",
      completed,
      progress: completed ? 100 : 0,
      lecture: normalized.lecture,
      sections: normalized.sections,
      resources: normalized.resources,
    };
  });

  return NextResponse.json({ modules: response });
}

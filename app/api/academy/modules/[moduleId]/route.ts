import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { normalizeModuleContent } from "@/lib/academy/normalizeModuleContent";
import { deriveWorkbookPrompts } from "@/lib/academy/workbookPrompts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { moduleId: string } }) {
  const user = await getUserOrThrow(request);
  const module = await prisma.academyModule.findUnique({
    where: { id: params.moduleId },
  });

  if (!module) {
    return NextResponse.json({ module: null }, { status: 404 });
  }

  const progress = await prisma.academyProgress.findUnique({
    where: {
      userId_moduleId: {
        userId: user.id,
        moduleId: module.id,
      },
    },
  });

  const normalized = normalizeModuleContent(module.content);
  const metadata = normalized.metadata ?? {};

  const workbookPrompts = deriveWorkbookPrompts(normalized.sections);

  return NextResponse.json({
    module: {
      id: module.id,
      slug: module.slug ?? module.id,
      title: module.title,
      subtitle: module.subtitle,
      description: module.description,
      journey: module.journey,
      lecture: normalized.lecture,
      sections: normalized.sections,
      objectives: normalized.objectives,
      resources: normalized.resources,
      estimatedMinutes: metadata.estimatedTime,
      stage: metadata.stage ?? module.subtitle ?? "Studio ritual",
      completed: progress?.completed ?? false,
      progress: progress?.completed ? 100 : 0,
      workbookPrompts,
    },
  });
}

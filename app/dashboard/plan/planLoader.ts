import "server-only";

import { prisma } from "@/lib/prisma";
import type { PlanLoaderOptions, PlanWorkspaceData } from "@/types/plan";

const buildEmptyWorkspace = (meta: PlanWorkspaceData["meta"]): PlanWorkspaceData => ({
  meta,
  learn: [],
  registry: {
    sections: [],
    items: [],
  },
  budget: {
    total: null,
    categories: [],
  },
  comparisons: [],
  mentorNotes: [],
  communitySignals: [],
});

export async function planLoader(opts: PlanLoaderOptions): Promise<PlanWorkspaceData> {
  const { userId, role, registryId } = opts;
  const registryKey = registryId ?? userId;
  const meta: PlanWorkspaceData["meta"] = {
    role,
    canEdit: role === "member",
    canMentor: role === "mentor" || role === "admin",
    canReview: role === "mentor" || role === "admin",
    canMessage: role !== "admin",
    canViewCommunity: true,
    registryId: registryId ?? null,
  };

  const emptyWorkspace = buildEmptyWorkspace(meta);

  try {
    const planSections = await prisma.planSection.findMany({
      where: { memberId: userId },
      orderBy: { createdAt: "asc" },
    });

    const sectionIds = planSections.map((section) => section.id);
    const planItems =
      sectionIds.length > 0
        ? await prisma.planRegistryItem.findMany({
            where: { sectionId: { in: sectionIds } },
          })
        : [];

    const planBudget = await prisma.planBudget.findUnique({
      where: { registryId: registryKey },
      include: { categories: true },
    });

    const planBudgetCategories = planBudget?.categories ?? [];

    const mentorNotesRaw = await prisma.planMentorNote.findMany({
      where: { registryId: registryKey },
      orderBy: { createdAt: "desc" },
    });

    const communitySignals = await prisma.communitySignal.findMany({
      where: { registryId: registryKey },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const academyProgress = await prisma.academyProgress.findMany({
      where: { userId },
      include: { module: true },
    });

    const learn = academyProgress.map((progress) => ({
      moduleId: progress.module.id,
      title: progress.module.title,
      journey: progress.module.journey,
      completed: Boolean(progress.completed),
      linkedRegistryItems: [],
    }));

    const sectionsWithItems = planSections.map((section) => ({
      ...section,
      items: planItems.filter((item) => item.sectionId === section.id),
    }));

    return {
      meta,
      learn,
      registry: {
        sections: sectionsWithItems,
        items: planItems,
      },
      budget: {
        total: planBudget?.total ?? null,
        categories: planBudgetCategories,
      },
      comparisons: [],
      mentorNotes: mentorNotesRaw.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
      })),
      communitySignals,
    };
  } catch (error) {
    console.error("planLoader: could not load workspace data", error);
    return emptyWorkspace;
  }
}

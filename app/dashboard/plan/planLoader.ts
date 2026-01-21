import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PlanLoaderOptions, PlanRole, PlanWorkspaceData } from "@/types/plan";

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
  const { memberId, viewerId, role, registryId } = opts;
  const normalizedRole = (role.toLowerCase() ?? "member") as PlanRole;
  const registryKey = registryId ?? memberId;
  const meta: PlanWorkspaceData["meta"] = {
    role: normalizedRole,
    canEdit: normalizedRole === "member",
    canMentor: normalizedRole === "mentor" || normalizedRole === "admin",
    canReview: normalizedRole === "mentor" || normalizedRole === "admin",
    canMessage: normalizedRole !== "admin",
    canViewCommunity: true,
    registryId: registryKey,
    memberId,
    viewerId,
  };

  const emptyWorkspace = buildEmptyWorkspace(meta);

  const ensureTable = async (tableName: string) => {
    const rows = (await prisma.$queryRaw<{ exists: boolean }[]>(
      Prisma.sql`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ${tableName}) AS exists`
    )) ?? [];
    const row = rows[0] ?? { exists: false };
    return row.exists;
  };

  try {
    const planSections = await prisma.planSection.findMany({
      where: { memberId },
      orderBy: { createdAt: "asc" },
    });

    const sectionIds = planSections.map((section) => section.id);
    const planItems =
      sectionIds.length > 0
        ? await prisma.planRegistryItem.findMany({
            where: { sectionId: { in: sectionIds } },
          })
        : [];

    const hasBudgetTable = await ensureTable("PlanBudget");
    const planBudget = hasBudgetTable
      ? await prisma.planBudget.findUnique({
          where: { registryId: registryKey },
          include: { categories: true },
        })
      : null;

    const planBudgetCategories = planBudget?.categories ?? [];

    const hasMentorNotes = await ensureTable("PlanMentorNote");
    const mentorNotesRaw = hasMentorNotes
      ? await prisma.planMentorNote.findMany({
          where: { registryId: registryKey },
          orderBy: { createdAt: "desc" },
        })
      : [];

    const hasCommunitySignals = await ensureTable("CommunitySignal");
    const communitySignals = hasCommunitySignals
      ? await prisma.communitySignal.findMany({
          where: { registryId: registryKey },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
      : [];

    const academyProgress = await prisma.academyProgress.findMany({
      where: { userId: memberId },
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

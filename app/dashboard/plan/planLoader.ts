import "server-only";

import { prisma } from "@/lib/prisma";
import { getUserOrThrow } from "@/lib/auth/getUser";
import type { PlanWorkspaceData, PlanRole } from "@/types/plan";

export async function planLoader(): Promise<PlanWorkspaceData> {
  const user = await getUserOrThrow();
  const memberId =
    user.role === "MENTOR" ? user.activeMemberId ?? user.id : user.id;
  const role = (user.role ?? "MEMBER").toLowerCase() as PlanRole;

  const meta = {
    role,
    canEdit: role === "member",
    canMentor: role === "mentor" || role === "admin",
    canReview: role === "mentor" || role === "admin",
    canMessage: role !== "admin",
    canViewCommunity: true,
  };

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

  const planBudgetModel = (prisma as any).planBudget;
  const planBudget =
    planBudgetModel?.findUnique != null
      ? await planBudgetModel.findUnique({
          where: { registryId: memberId },
        })
      : null;

  const planBudgetCategoryModel = (prisma as any).planBudgetCategory;
  const planBudgetCategories =
    planBudget && planBudget.id && planBudgetCategoryModel?.findMany != null
      ? await planBudgetCategoryModel.findMany({
          where: { budgetId: planBudget.id },
          orderBy: { createdAt: "asc" },
        })
      : [];

  const planMentorNoteModel = (prisma as any).planMentorNote;
  const mentorNotes =
    planMentorNoteModel?.findMany != null
      ? await planMentorNoteModel.findMany({
          orderBy: { createdAt: "desc" },
        })
      : [];

  const communitySignalModel = (prisma as any).communitySignal;
  const communitySignals =
    communitySignalModel?.findMany != null
      ? await communitySignalModel.findMany({
          where: { registryId: memberId },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
      : [];

  const academyProgressModel = (prisma as any).academyProgress;
  const academyProgress =
    academyProgressModel?.findMany != null
      ? await academyProgressModel.findMany({
          where: { userId: memberId },
          include: { module: true },
        })
      : [];

  const learn = academyProgress.map((progress) => ({
    moduleId: progress.module.id,
    title: progress.module.title,
    journey: progress.module.journey,
    completed: progress.completed,
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
    mentorNotes,
    communitySignals,
  };
}

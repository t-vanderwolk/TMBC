import { prisma } from "@/lib/prisma";

export type PlanDecisionState = "considering" | "waiting" | "approved" | "deferred";

type PlanSectionInput = {
  memberId: string;
  sectionKey: string;
  decisionState?: PlanDecisionState | null;
  mentorNote?: string | null;
  memberNote?: string | null;
  memberAcknowledgement?: string | null;
  updatedByRole: "MEMBER" | "MENTOR";
};

export const listPlanSectionsForMember = async (memberId: string) => {
  return prisma.planSection.findMany({
    where: { memberId },
    orderBy: { updatedAt: "desc" },
  });
};

export const upsertPlanSection = async ({
  memberId,
  sectionKey,
  decisionState,
  mentorNote,
  memberNote,
  memberAcknowledgement,
  updatedByRole,
}: PlanSectionInput) => {
  const updateData: Record<string, unknown> = { updatedByRole };
  if (decisionState !== undefined) updateData.decisionState = decisionState;
  if (mentorNote !== undefined) updateData.mentorNote = mentorNote;
  if (memberNote !== undefined) updateData.memberNote = memberNote;
  if (memberAcknowledgement !== undefined) {
    updateData.memberAcknowledgement = memberAcknowledgement;
  }

  return prisma.planSection.upsert({
    where: {
      memberId_sectionKey: {
        memberId,
        sectionKey,
      },
    },
    update: updateData,
    create: {
      memberId,
      sectionKey,
      decisionState: decisionState ?? null,
      mentorNote: mentorNote ?? null,
      memberNote: memberNote ?? null,
      memberAcknowledgement: memberAcknowledgement ?? null,
      updatedByRole,
    },
  });
};

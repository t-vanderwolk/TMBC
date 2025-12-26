import { NextResponse } from "next/server";
import { WorkbookEntryType } from "@prisma/client";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { listRegistryItems } from "@/lib/services/server/registry.service";
import { OnboardingIntelligenceService } from "@/lib/services/server/onboardingIntelligence.service";

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") {
    throw new Error("Only mentors can access mentor plan views.");
  }
  return user;
};

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to load mentor plan.";
  const status = message.includes("Only mentors") ? 403 : 400;
  return NextResponse.json({ error: message }, { status });
};

export async function GET(
  _request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    await requireMentor();
    const member = await prisma.user.findUnique({
      where: { id: params.memberId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!member || member.role !== "MEMBER") {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    const [registryItems, onboarding, workbookEntries] = await Promise.all([
      listRegistryItems(member.id),
      OnboardingIntelligenceService.getLatestQuestionnaire(member.id),
      prisma.workbookEntry.findMany({
        where: { userId: member.id, type: WorkbookEntryType.REFLECTION },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const moduleIds = Array.from(new Set(workbookEntries.map((entry) => entry.moduleId)));
    const modules = await prisma.academyModule.findMany({
      where: { id: { in: moduleIds } },
      select: { id: true, title: true },
    });
    const moduleLookup = new Map(modules.map((mod) => [mod.id, mod.title]));

    const workbook = workbookEntries.map((entry) => {
      const responses = (entry.content as { responses?: Record<string, string> })?.responses ?? {};
      return {
        id: entry.id,
        moduleId: entry.moduleId,
        moduleTitle: moduleLookup.get(entry.moduleId) ?? "Module notes",
        updatedAt: entry.updatedAt.toISOString(),
        responses: Object.entries(responses).map(([prompt, response]) => ({
          prompt,
          response,
        })),
      };
    });

    return NextResponse.json({
      member,
      onboarding,
      workbook,
      registryItems,
    });
  } catch (error) {
    return handleError(error);
  }
}

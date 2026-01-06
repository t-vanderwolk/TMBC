import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import type { PlanDecisionState } from "@/lib/services/server/planSections.service";
import { listPlanSectionsForMember, upsertPlanSection } from "@/lib/services/server/planSections.service";

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") {
    throw new Error("Only mentors can access plan sections.");
  }
  return user;
};

const handleError = (error: unknown, fallback = "Unable to update plan section.") => {
  const message = error instanceof Error ? error.message : fallback;
  const status = message.includes("Only mentors") ? 403 : 400;
  return NextResponse.json({ error: message }, { status });
};

export async function GET(
  _request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    await requireMentor();
    const sections = await listPlanSectionsForMember(params.memberId);
    return NextResponse.json({ sections });
  } catch (error) {
    return handleError(error, "Unable to load plan sections.");
  }
}

export async function POST(
  request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    await requireMentor();
    const payload = (await request.json()) as {
      sectionKey?: string;
      decisionState?: string | null;
      mentorNote?: string | null;
    };

    const sectionKey = typeof payload.sectionKey === "string" ? payload.sectionKey.trim() : "";
    if (!sectionKey) {
      return NextResponse.json({ error: "Section key is required." }, { status: 400 });
    }

    const allowedDecisionStates: PlanDecisionState[] = ["considering", "waiting", "approved", "deferred"];
    const decisionState = allowedDecisionStates.includes(payload.decisionState as PlanDecisionState)
      ? (payload.decisionState as PlanDecisionState)
      : undefined;

    const section = await upsertPlanSection({
      memberId: params.memberId,
      sectionKey,
      decisionState,
      mentorNote: payload.mentorNote ?? undefined,
      updatedByRole: "MENTOR",
    });

    return NextResponse.json({ section });
  } catch (error) {
    return handleError(error);
  }
}

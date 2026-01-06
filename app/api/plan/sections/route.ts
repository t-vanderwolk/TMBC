import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { listPlanSectionsForMember, upsertPlanSection } from "@/lib/services/server/planSections.service";

const handleError = (error: unknown, fallback = "Unable to update plan section.") => {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 400 });
};

export async function GET() {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "MEMBER") {
      return NextResponse.json({ error: "Only members can access plan sections." }, { status: 403 });
    }
    const sections = await listPlanSectionsForMember(user.id);
    return NextResponse.json({ sections });
  } catch (error) {
    return handleError(error, "Unable to load plan sections.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "MEMBER") {
      return NextResponse.json({ error: "Only members can update plan sections." }, { status: 403 });
    }
    const payload = (await request.json()) as {
      sectionKey?: string;
      decisionState?: string | null;
      memberNote?: string | null;
      memberAcknowledgement?: string | null;
    };

    const sectionKey = typeof payload.sectionKey === "string" ? payload.sectionKey.trim() : "";
    if (!sectionKey) {
      return NextResponse.json({ error: "Section key is required." }, { status: 400 });
    }

    const section = await upsertPlanSection({
      memberId: user.id,
      sectionKey,
      decisionState: payload.decisionState ?? undefined,
      memberNote: payload.memberNote ?? undefined,
      memberAcknowledgement: payload.memberAcknowledgement ?? undefined,
      updatedByRole: "MEMBER",
    });

    return NextResponse.json({ section });
  } catch (error) {
    return handleError(error);
  }
}

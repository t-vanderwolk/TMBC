import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { createMentorProductSuggestion } from "@/lib/services/server/registry.service";

// TMBC Canon:
// Mentors advise.
// Monetization is admin-owned.

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") {
    throw new Error("Only mentors can send plan suggestions.");
  }
  return user;
};

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to send suggestion.";
  const status = message.includes("Only mentors") ? 403 : 400;
  return NextResponse.json({ error: message }, { status });
};

export async function POST(
  request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const mentor = await requireMentor();
    const member = await prisma.user.findUnique({
      where: { id: params.memberId },
      select: { id: true, role: true },
    });

    if (!member || member.role !== "MEMBER") {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    const payload = (await request.json()) as {
      title?: string;
      brand?: string;
      category?: string;
      mentorNote?: string;
      productId?: string | null;
    };

    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const category = typeof payload.category === "string" ? payload.category.trim() : "";
    const mentorNote = typeof payload.mentorNote === "string" ? payload.mentorNote.trim() : "";

    if (!title || !category || !mentorNote) {
      return NextResponse.json(
        { error: "Title, category, and mentor rationale are required." },
        { status: 400 },
      );
    }

    const item = await createMentorProductSuggestion({
      mentorId: mentor.id,
      memberId: member.id,
      productId: payload.productId ?? null,
      title,
      brand: typeof payload.brand === "string" ? payload.brand.trim() : null,
      category,
      mentorNote,
    });

    return NextResponse.json({ item });
  } catch (error) {
    return handleError(error);
  }
}

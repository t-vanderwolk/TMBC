import { NextRequest, NextResponse } from "next/server";

import { Role } from "@prisma/client";
import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  createMentorNote,
  getMentorNotesForMember,
  MentorNotePermissionError,
} from "@/lib/services/server/mentorNotes.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.MENTOR) {
    console.warn("[MentorNote] unauthorized access", { mentorId: user.id });
    return NextResponse.json({ error: "Mentor access required." }, { status: 403 });
  }

  const memberId = request.nextUrl.searchParams.get("memberId");
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  if (!memberId) {
    return NextResponse.json({ error: "memberId is required." }, { status: 400 });
  }

  try {
    const notes = await getMentorNotesForMember({
      mentorId: user.id,
      memberId,
      limit,
    });
    return NextResponse.json({ notes });
  } catch (error) {
    console.error("[MentorNote] read failed", { mentorId: user.id, memberId, error });
    return NextResponse.json({ error: "Unable to load notes." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.MENTOR) {
    console.warn("[MentorNote] unauthorized access", { mentorId: user.id });
    return NextResponse.json({ error: "Mentor access required." }, { status: 403 });
  }

  let payload: { memberId?: string; content?: string } | null = null;
  try {
    payload = (await request.json()) ?? null;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const memberId = payload?.memberId;
  const content = payload?.content;

  if (!memberId || !content?.trim()) {
    return NextResponse.json(
      { error: "memberId and content are required." },
      { status: 400 },
    );
  }

  try {
    const note = await createMentorNote({
      mentorId: user.id,
      memberId,
      content,
    });
    return NextResponse.json({ note });
  } catch (error) {
    console.error("[MentorNote] create failed", { mentorId: user.id, memberId, error });
    const message =
      error instanceof MentorNotePermissionError
        ? error.message
        : error instanceof Error
        ? error.message
        : "Unable to create note.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

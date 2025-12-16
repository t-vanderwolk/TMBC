import { NextRequest, NextResponse } from "next/server";

import { Role } from "@prisma/client";
import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  updateMentorNote,
  MentorNotePermissionError,
} from "@/lib/services/server/mentorNotes.service";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: { params: { noteId?: string } }) {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.MENTOR) {
    console.warn("[MentorNote] unauthorized update attempt", { mentorId: user.id });
    return NextResponse.json({ error: "Mentor access required." }, { status: 403 });
  }

  const noteId = params?.noteId;
  if (!noteId) {
    return NextResponse.json({ error: "Note ID is required." }, { status: 400 });
  }

  let payload: { content?: string } | null = null;
  try {
    payload = (await request.json()) ?? null;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const content = payload?.content;
  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  try {
    const note = await updateMentorNote({
      mentorId: user.id,
      noteId,
      content,
    });
    return NextResponse.json({ note });
  } catch (error) {
    if (error instanceof MentorNotePermissionError) {
      console.warn("[MentorNote] unauthorized edit", {
        mentorId: user.id,
        noteId,
        error,
      });
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[MentorNote] update failed", { mentorId: user.id, noteId, error });
    const message =
      error instanceof Error ? error.message : "Unable to update note.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

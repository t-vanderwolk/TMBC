import { MentorNote } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export class MentorNotePermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MentorNotePermissionError';
  }
}

const sanitizeContent = (content: string) => content.trim();

const mapNote = (note: MentorNote) => ({
  id: note.id,
  content: note.content,
  source: 'manual',
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
});

export const getMentorNotesForMember = async ({
  mentorId,
  memberId,
  limit = 10,
}: {
  mentorId: string;
  memberId: string;
  limit?: number;
}) => {
  const notes = await prisma.mentorNote.findMany({
    where: {
      mentorId,
      memberId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return notes.map(mapNote);
};

export const createMentorNote = async ({
  mentorId,
  memberId,
  content,
}: {
  mentorId: string;
  memberId: string;
  content: string;
}) => {
  const trimmed = sanitizeContent(content);
  if (!trimmed) {
    throw new Error('Note content cannot be empty.');
  }

  const note = await prisma.mentorNote.create({
    data: {
      mentorId,
      memberId,
      moduleId: null,
      productId: null,
      content: trimmed,
    },
  });

  console.info('[MentorNote] created', {
    mentorId,
    memberId,
    noteId: note.id,
  });

  return mapNote(note);
};

export const updateMentorNote = async ({
  mentorId,
  noteId,
  content,
}: {
  mentorId: string;
  noteId: string;
  content: string;
}) => {
  const trimmed = sanitizeContent(content);
  if (!trimmed) {
    throw new Error('Note content cannot be empty.');
  }

  const existing = await prisma.mentorNote.findUnique({
    where: { id: noteId },
  });

  if (!existing) {
    throw new MentorNotePermissionError('Mentor note not found.');
  }

  if (existing.mentorId !== mentorId) {
    throw new MentorNotePermissionError('You are not allowed to modify this note.');
  }

  const note = await prisma.mentorNote.update({
    where: { id: noteId },
    data: {
      content: trimmed,
    },
  });

  console.info('[MentorNote] updated', {
    mentorId,
    memberId: note.memberId,
    noteId: note.id,
  });

  return mapNote(note);
};

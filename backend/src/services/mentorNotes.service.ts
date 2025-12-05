import { Prisma } from '@prisma/client';

import { prisma } from '../../prisma/client';

export type MentorNoteForModule = {
  id: string;
  moduleId: string | null;
  mentorId: string;
  mentorName: string | null;
  content: string;
  createdAt: string;
};

interface GetMentorNotesForModuleInput {
  memberId: string;
  moduleId: string;
}

interface AddMentorNoteInput extends GetMentorNotesForModuleInput {
  mentorId: string;
  content: string;
}

type MentorNoteWithMentor = Prisma.MentorNoteGetPayload<{
  include: { mentor: { select: { id: true; name: true } } };
}>;

const mapMentorNote = (note: MentorNoteWithMentor): MentorNoteForModule => ({
  id: note.id,
  moduleId: note.moduleId,
  mentorId: note.mentorId,
  mentorName: note.mentor?.name || null,
  content: note.note,
  createdAt: note.createdAt.toISOString(),
});

export const getMentorNotesForModule = async ({ memberId, moduleId }: GetMentorNotesForModuleInput) => {
  const notes = await prisma.mentorNote.findMany({
    where: {
      memberId,
      moduleId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return notes.map(mapMentorNote);
};

export const addMentorNote = async ({ memberId, moduleId, mentorId, content }: AddMentorNoteInput) => {
  const note = await prisma.mentorNote.create({
    data: {
      memberId,
      moduleId,
      mentorId,
      note: content,
    },
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return mapMentorNote(note);
};

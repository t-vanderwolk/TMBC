import { Role } from '@prisma/client';

import { prisma } from '../utils/prisma';

export interface MentorSummary {
  id: string;
  name: string | null;
  mentees: number;
}

export const getMentorSummaries = async (): Promise<MentorSummary[]> => {
  const mentors = await prisma.user.findMany({
    where: { role: Role.MENTOR },
    include: {
      invites: {
        where: { used: true },
      },
    },
  });

  return mentors.map((mentor) => ({
    id: mentor.id,
    name: mentor.name,
    mentees: mentor.invites.length,
  }));
};

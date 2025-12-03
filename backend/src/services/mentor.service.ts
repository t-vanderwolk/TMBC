import { Role } from '@prisma/client';

import { prisma } from '../../prisma/client';

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

export const getMentorOverview = async (mentorId: string) => {
  // TODO: Replace placeholder stats with Prisma analytics (registry reviews, check-ins, etc.)
  const mentees = await getMentorMentees(mentorId);
  return {
    menteeCount: mentees.length,
    pendingRegistryReviews: mentees.filter((mentee) => mentee.registryStatus === 'Needs feedback').length,
    upcomingTouchpoints: [
      { mentee: mentees[0]?.name || 'TBD', date: 'Thu · 3pm CST', topic: 'Nursery review' },
    ],
  };
};

export const getMentorMentees = async (mentorId: string) => {
  // TODO: Query mentees assigned to mentor via Prisma relations
  return [
    {
      id: 'mentee-1',
      name: 'Taylor V.',
      dueDate: '2024-07-12',
      focus: 'Nursery styling',
      registryStatus: 'Needs feedback',
      mentorId,
    },
    {
      id: 'mentee-2',
      name: 'Morgan A.',
      dueDate: '2024-08-03',
      focus: 'Feeding plan',
      registryStatus: 'Approved',
      mentorId,
    },
  ];
};

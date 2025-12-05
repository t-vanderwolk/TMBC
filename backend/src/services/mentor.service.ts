import { Role } from '@prisma/client';

import { prisma } from '../../prisma/client';

export interface MentorSummary {
  id: string;
  name: string | null;
  mentees: number;
}

export type MentorMentee = {
  id: string;
  name: string;
  dueDate: string;
  focus: string;
  registryStatus: string;
  mentorId: string;
  trimester: string;
  lastInteraction: string;
};

export type MentorTask = {
  id: string;
  type: string;
  title: string;
  member: string;
  due: string;
};

export type MentorJournalEntry = {
  id: string;
  member: string;
  preview: string;
  updatedAt: string;
};

export type MentorCircleEvent = {
  id: string;
  title: string;
  type: string;
  time: string;
  rsvpCount: number;
};

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

export const getMentorTasks = async (_mentorId: string) => {
  return [
    { id: 't1', type: 'Registry', title: 'Review crib options', member: 'Elena', due: '2025-12-10' },
    { id: 't2', type: 'Academy', title: 'Approve module recap', member: 'Wren', due: '2025-12-12' },
    { id: 't3', type: 'Check-in', title: 'Follow up on feeding', member: 'Noor', due: '2025-12-14' },
    { id: 't4', type: 'Product', title: 'Flag stroller duplicates', member: 'Morgan', due: '2025-12-15' },
    { id: 't5', type: 'Journal', title: 'Encourage postpartum ritual', member: 'Elena', due: '2025-12-17' },
  ];
};

export const getMentorJournalNeeds = async (_mentorId: string) => {
  return [
    {
      id: 'j1',
      member: 'Elena',
      preview: 'Just finished my nursery vision board and would love your notes on the lighting ',
      updatedAt: 'Dec 1 · 2:15 PM',
    },
    {
      id: 'j2',
      member: 'Wren',
      preview: 'Feeling overwhelmed about packing the hospital bag. What should stay in reach?',
      updatedAt: 'Dec 1 · 9:42 AM',
    },
    {
      id: 'j3',
      member: 'Morgan',
      preview: 'Quick pulse: feeding time is unpredictable—any rituals help calm Nora?',
      updatedAt: 'Nov 30 · 6:12 PM',
    },
  ];
};

export const getMentorUpcomingEvents = async (_mentorId: string) => {
  return [
    { id: 'c1', title: 'Fourth Trimester Circle', type: 'Circle', time: 'Thu · 12pm CST', rsvpCount: 14 },
    { id: 'c2', title: 'Mentor Review Salon', type: 'Salon', time: 'Mon · 4pm CST', rsvpCount: 8 },
    { id: 'c3', title: '1:1 Concierge Check-in', type: 'Session', time: 'Tue · 10am CST', rsvpCount: 3 },
  ];
};

export const getMentorOverview = async (mentorId: string) => {
  const mentees = await getMentorMentees(mentorId);
  const journals = await getMentorJournalNeeds(mentorId);
  const tasks = await getMentorTasks(mentorId);

  return {
    mentees: mentees.length,
    journalsAwaiting: journals.length,
    pendingTasks: tasks.length,
  };
};

export const getMentorMentees = async (mentorId: string): Promise<MentorMentee[]> => {
  return [
    {
      id: 'mentee-1',
      name: 'Taylor V.',
      dueDate: '2024-07-12',
      focus: 'Nursery styling',
      registryStatus: 'Needs attention',
      mentorId,
      trimester: 'Trimester 3',
      lastInteraction: 'Last message · 2 days ago',
    },
    {
      id: 'mentee-2',
      name: 'Morgan A.',
      dueDate: '2024-08-03',
      focus: 'Feeding plan',
      registryStatus: 'On track',
      mentorId,
      trimester: 'Trimester 2',
      lastInteraction: 'Shared journal · 5 days ago',
    },
    {
      id: 'mentee-3',
      name: 'Noor H.',
      dueDate: '2024-08-21',
      focus: 'Postpartum reset',
      registryStatus: 'Flagged',
      mentorId,
      trimester: 'Trimester 3',
      lastInteraction: 'Needs reassurance · today',
    },
  ];
};

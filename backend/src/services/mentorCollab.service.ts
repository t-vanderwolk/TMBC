import { Role } from '@prisma/client';

import { prisma } from '../utils/prisma';
import { listRegistryItems } from './registry.service';
import { listJournalEntries } from './journal.service';

type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string };

const handleError = <T>(error: any, fallback = 'Mentor collaboration service error'): ServiceResult<T> => {
  const message = typeof error?.message === 'string' ? error.message : fallback;
  return { ok: false, error: message };
};

const mapFeedback = (feedback: any) => ({
  id: feedback.id,
  message: feedback.message,
  createdAt: feedback.createdAt,
  updatedAt: feedback.updatedAt,
  mentor: feedback.mentor ? { id: feedback.mentor.id, name: feedback.mentor.name } : null,
  member: feedback.member ? { id: feedback.member.id, name: feedback.member.name } : null,
  module: feedback.module ? { id: feedback.module.id, title: feedback.module.title } : null,
  registryItem: feedback.registryItem ? { id: feedback.registryItem.id, title: feedback.registryItem.title } : null,
});

const fetchMenteesViaInvites = async (mentorId: string) => {
  const invites = await prisma.invite.findMany({
    where: { createdById: mentorId, used: true },
    include: { usedBy: { select: { id: true, name: true, email: true, createdAt: true } } },
  });

  const mentees = invites
    .map((invite) => invite.usedBy)
    .filter((user): user is { id: string; name: string | null; email: string | null; createdAt: Date } => Boolean(user));

  return mentees.map((mentee) => ({
    id: mentee.id,
    name: mentee.name,
    email: mentee.email,
    onboardedAt: mentee.createdAt,
  }));
};

const fetchSharedJournalEntries = async (mentorId: string, memberId: string) => {
  const shares = await prisma.journalShare.findMany({
    where: { mentorId, memberId, allowed: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!shares.length) {
    return [];
  }

  const memberEntries = await listJournalEntries(memberId);
  const entryMap = new Map(memberEntries.map((entry) => [entry.id, entry]));

  return shares.map((share) => {
    const entry = entryMap.get(share.journalId);
    return {
      shareId: share.id,
      journalId: share.journalId,
      sharedAt: share.createdAt,
      excerpt: entry ? entry.content.slice(0, 140) : '',
    };
  });
};

export const getMentorOverview = async (mentorId: string) => {
  try {
    const [tasks, feedback, mentees] = await Promise.all([
      prisma.mentorTask.findMany({
        where: { mentorId, completed: false },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.mentorFeedback.findMany({
        where: { mentorId },
        include: {
          member: { select: { id: true, name: true } },
          module: { select: { id: true, title: true } },
          registryItem: { select: { id: true, title: true } },
          mentor: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      fetchMenteesViaInvites(mentorId),
    ]);

    const overview = {
      menteeCount: mentees.length,
      pendingTasks: tasks.length,
      recentFeedback: feedback.map(mapFeedback),
      spotlightMentees: mentees.slice(0, 3),
    };

    return { ok: true, data: overview };
  } catch (error) {
    return handleError(error);
  }
};

export const getMenteeList = async (mentorId: string) => {
  try {
    const mentees = await fetchMenteesViaInvites(mentorId);
    if (mentees.length) {
      return { ok: true, data: mentees };
    }

    const fallbackMembers = await prisma.user.findMany({
      where: { role: Role.MEMBER },
      select: { id: true, name: true, email: true, createdAt: true },
      take: 5,
    });

    return {
      ok: true,
      data: fallbackMembers.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        onboardedAt: member.createdAt,
      })),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getMemberProfileForMentor = async (mentorId: string, memberId: string) => {
  try {
    const member = await prisma.user.findUnique({
      where: { id: memberId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!member) {
      return { ok: false, error: 'Member not found' };
    }

    const [tasks, feedback, registryItems, sharedJournal] = await Promise.all([
      prisma.mentorTask.findMany({
        where: { mentorId, memberId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mentorFeedback.findMany({
        where: { mentorId, memberId },
        include: {
          mentor: { select: { id: true, name: true } },
          member: { select: { id: true, name: true } },
          module: { select: { id: true, title: true } },
          registryItem: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      listRegistryItems(memberId, mentorId),
      fetchSharedJournalEntries(mentorId, memberId),
    ]);

    return {
      ok: true,
      data: {
        member,
        tasks,
        feedback: feedback.map(mapFeedback),
        registryItems,
        sharedJournal,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};

type FeedbackInput = {
  mentorId: string;
  memberId: string;
  moduleId?: string;
  registryItemId?: string;
  message: string;
};

export const addMentorFeedback = async ({ mentorId, memberId, moduleId, registryItemId, message }: FeedbackInput) => {
  try {
    const entry = await prisma.mentorFeedback.create({
      data: { mentorId, memberId, moduleId, registryItemId, message },
      include: {
        mentor: { select: { id: true, name: true } },
        member: { select: { id: true, name: true } },
        module: { select: { id: true, title: true } },
        registryItem: { select: { id: true, title: true } },
      },
    });

    return { ok: true, data: mapFeedback(entry) };
  } catch (error) {
    return handleError(error, 'Unable to save mentor feedback');
  }
};

export const getFeedbackForMember = async (memberId: string, registryItemId?: string, moduleId?: string) => {
  try {
    const feedback = await prisma.mentorFeedback.findMany({
      where: {
        memberId,
        ...(registryItemId ? { registryItemId } : {}),
        ...(moduleId ? { moduleId } : {}),
      },
      include: {
        mentor: { select: { id: true, name: true } },
        member: { select: { id: true, name: true } },
        module: { select: { id: true, title: true } },
        registryItem: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { ok: true, data: feedback.map(mapFeedback) };
  } catch (error) {
    return handleError(error);
  }
};

type TaskInput = {
  mentorId: string;
  memberId: string;
  type: string;
  referenceId?: string;
  title: string;
  description?: string;
};

export const createTask = async ({ mentorId, memberId, type, referenceId, title, description }: TaskInput) => {
  try {
    const task = await prisma.mentorTask.create({
      data: { mentorId, memberId, type, referenceId, title, description },
    });
    return { ok: true, data: task };
  } catch (error) {
    return handleError(error, 'Unable to create task');
  }
};

export const completeTask = async (taskId: string) => {
  try {
    const task = await prisma.mentorTask.update({
      where: { id: taskId },
      data: { completed: true },
    });
    return { ok: true, data: task };
  } catch (error) {
    return handleError(error, 'Unable to complete task');
  }
};

export const getTasksForMentor = async (mentorId: string) => {
  try {
    const tasks = await prisma.mentorTask.findMany({
      where: { mentorId },
      orderBy: { createdAt: 'desc' },
    });
    return { ok: true, data: tasks };
  } catch (error) {
    return handleError(error);
  }
};

export const getTasksForMember = async (memberId: string) => {
  try {
    const tasks = await prisma.mentorTask.findMany({
      where: { memberId, completed: false },
      orderBy: { createdAt: 'asc' },
    });
    return { ok: true, data: tasks };
  } catch (error) {
    return handleError(error);
  }
};

type ShareJournalInput = {
  journalId: string;
  memberId: string;
  mentorId: string;
  allowed?: boolean;
};

export const shareJournalEntry = async ({ journalId, memberId, mentorId, allowed = true }: ShareJournalInput) => {
  try {
    const existing = await prisma.journalShare.findFirst({
      where: { journalId, memberId, mentorId },
    });

    if (existing) {
      const share = await prisma.journalShare.update({
        where: { id: existing.id },
        data: { allowed },
      });
      return { ok: true, data: share };
    }

    const share = await prisma.journalShare.create({
      data: { journalId, memberId, mentorId, allowed },
    });
    return { ok: true, data: share };
  } catch (error) {
    return handleError(error, 'Unable to update journal share');
  }
};

export const getSharedJournalEntries = async (mentorId: string, memberId: string) => {
  try {
    const entries = await fetchSharedJournalEntries(mentorId, memberId);
    return { ok: true, data: entries };
  } catch (error) {
    return handleError(error);
  }
};

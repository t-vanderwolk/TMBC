import { prisma } from '@/lib/prisma';
import { JournalEntryType } from '@prisma/client';

type CreateJournalEntryInput = {
  userId: string;
  type: JournalEntryType;
  title?: string | null;
  content: string;
  emotionTags?: string[];
  sourceLabel?: string | null;
  isPrivate?: boolean;
};

export type UpdateJournalEntryInput = {
  title?: string | null;
  content?: string;
  emotionTags?: string[];
  sourceLabel?: string | null;
  isPrivate?: boolean;
};

export type MemberJournalEntry = {
  id: string;
  userId: string;
  type: JournalEntryType;
  title: string | null;
  content: string;
  emotionTags: string[];
  sourceLabel: string | null;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const listJournalEntries = async (userId: string): Promise<MemberJournalEntry[]> => {
  return prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const createJournalEntry = async (payload: CreateJournalEntryInput) => {
  return prisma.journalEntry.create({
    data: {
      userId: payload.userId,
      type: payload.type,
      title: payload.title ?? null,
      content: payload.content,
      emotionTags: payload.emotionTags ?? [],
      sourceLabel: payload.sourceLabel ?? null,
      isPrivate: payload.isPrivate ?? true,
    },
  });
};

export const updateJournalEntry = async (
  entryId: string,
  userId: string,
  updates: UpdateJournalEntryInput,
): Promise<MemberJournalEntry> => {
  const entry = await prisma.journalEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) {
    throw new Error('Journal entry not found');
  }

  const data: UpdateJournalEntryInput = {};
  if (updates.title !== undefined) {
    data.title = updates.title;
  }
  if (updates.content !== undefined) {
    data.content = updates.content;
  }
  if (updates.emotionTags !== undefined) {
    data.emotionTags = updates.emotionTags;
  }
  if (updates.sourceLabel !== undefined) {
    data.sourceLabel = updates.sourceLabel;
  }
  if (updates.isPrivate !== undefined) {
    data.isPrivate = updates.isPrivate;
  }

  if (Object.keys(data).length === 0) {
    return entry;
  }

  return prisma.journalEntry.update({
    where: { id: entryId },
    data,
  });
};

export const deleteJournalEntry = async (entryId: string, userId: string) => {
  const entry = await prisma.journalEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) {
    throw new Error('Journal entry not found');
  }
  await prisma.journalEntry.delete({ where: { id: entryId } });
};

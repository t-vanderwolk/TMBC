import { Prisma, WorkbookEntry, WorkbookEntryType } from '@prisma/client';

import { prisma } from '../utils/prisma';

export type WorkbookEntrySectionType = 'journal' | 'moodboard' | 'checklist' | 'reflection';

const sectionToEnumMap: Record<WorkbookEntrySectionType, WorkbookEntryType> = {
  journal: 'JOURNAL',
  moodboard: 'MOODBOARD',
  checklist: 'CHECKLIST',
  reflection: 'REFLECTION',
};

const enumToSectionMap: Record<WorkbookEntryType, WorkbookEntrySectionType> = {
  JOURNAL: 'journal',
  MOODBOARD: 'moodboard',
  CHECKLIST: 'checklist',
  REFLECTION: 'reflection',
};

type WorkbookEntryPayload = {
  id: string;
  moduleId: string;
  type: WorkbookEntrySectionType;
  content: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

const mapEntry = (entry: WorkbookEntry): WorkbookEntryPayload => ({
  id: entry.id,
  moduleId: entry.moduleId,
  type: enumToSectionMap[entry.type],
  content: entry.content,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
});

export const createWorkbookEntry = async (payload: {
  userId: string;
  moduleId: string;
  type: WorkbookEntrySectionType;
  content: Prisma.InputJsonValue;
}) => {
  const entry = await prisma.workbookEntry.create({
    data: {
      userId: payload.userId,
      moduleId: payload.moduleId,
      type: sectionToEnumMap[payload.type],
      content: payload.content,
    },
  });
  return mapEntry(entry);
};

export const listWorkbookEntries = async (params: { userId: string; moduleId: string }) => {
  const entries = await prisma.workbookEntry.findMany({
    where: { userId: params.userId, moduleId: params.moduleId },
  });
  return entries.map(mapEntry);
};

export const updateWorkbookEntry = async (payload: {
  id: string;
  userId: string;
  content: Prisma.InputJsonValue;
}) => {
  const existing = await prisma.workbookEntry.findUnique({
    where: { id: payload.id },
  });

  if (!existing || existing.userId !== payload.userId) {
    throw new Error('Workbook entry not found');
  }

  const entry = await prisma.workbookEntry.update({
    where: { id: payload.id },
    data: {
      content: payload.content,
    },
  });

  return mapEntry(entry);
};

export const deleteWorkbookEntry = async (payload: { id: string; userId: string }) => {
  const existing = await prisma.workbookEntry.findUnique({
    where: { id: payload.id },
  });

  if (!existing || existing.userId !== payload.userId) {
    throw new Error('Workbook entry not found');
  }

  await prisma.workbookEntry.delete({ where: { id: payload.id } });
  return true;
};

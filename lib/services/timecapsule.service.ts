import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export type TimeCapsuleInput = {
  type: string;
  content: Record<string, unknown> | string;
  scheduledFor?: string;
  isPrivate?: boolean;
};

export async function createCapsule(userId: string, payload: TimeCapsuleInput) {
  return prisma.timeCapsule.create({
    data: {
      userId,
      type: payload.type,
      content: payload.content as Prisma.InputJsonValue,
      scheduledFor: payload.scheduledFor ? new Date(payload.scheduledFor) : undefined,
      isPrivate: payload.isPrivate ?? true,
    },
  });
}

export async function getUserCapsules(userId: string) {
  return prisma.timeCapsule.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCapsule(userId: string, capsuleId: number) {
  return prisma.timeCapsule.findFirst({
    where: { userId, id: capsuleId },
  });
}

export async function getScheduledCapsules() {
  return prisma.timeCapsule.findMany({
    where: { scheduledFor: { gt: new Date() } },
    orderBy: { scheduledFor: 'asc' },
  });
}

export async function updateCapsule(userId: string, capsuleId: number, fields: Partial<TimeCapsuleInput>) {
  return prisma.timeCapsule.updateMany({
    where: { userId, id: capsuleId },
    data: {
      type: fields.type,
      content: fields.content as Prisma.InputJsonValue | undefined,
      scheduledFor: fields.scheduledFor ? new Date(fields.scheduledFor) : undefined,
      isPrivate: fields.isPrivate,
    },
  });
}

export async function deleteCapsule(userId: string, capsuleId: number) {
  return prisma.timeCapsule.deleteMany({
    where: { userId, id: capsuleId },
  });
}

export async function triggerScheduledReleases() {
  return { released: [], message: 'Scheduled release cron placeholder.' };
}

export function isLateNightLogin(timestamp: Date = new Date()) {
  const hour = timestamp.getHours();
  return hour >= 22 || hour < 5;
}

export function isUserOverwhelmed(text: string) {
  const normalized = text.toLowerCase();
  return ['overwhelmed', 'stress', 'swim'].some((keyword) => normalized.includes(keyword));
}

export function offerCapsuleDraft() {
  return {
    title: 'Draft calm letter',
    prompt: 'Take 3 breaths and describe the rhythm you crave.',
  };
}

import { Prisma, RegistryStatus } from '@prisma/client';

import { prisma } from '../utils/prisma';

export type ConflictField = 'quantity' | 'status' | 'customNote' | 'affiliateUrl';

export type ConflictRecordInput = {
  userId: string;
  itemId: string;
  field: ConflictField;
  localValue?: string | null;
  remoteValue?: string | null;
};

type ClearConflictInput = {
  userId: string;
  itemId: string;
  field: ConflictField;
};

const parseQuantity = (value?: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseStatus = (value?: string | null) => {
  if (!value) return undefined;
  const normalized = value.toUpperCase();
  const statuses = Object.values(RegistryStatus);
  return statuses.includes(normalized as RegistryStatus) ? (normalized as RegistryStatus) : undefined;
};

const normalizeValue = (value?: string | null) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return String(value);
};

export const recordConflicts = async (conflicts: ConflictRecordInput[]) => {
  if (!conflicts.length) return;

  await Promise.all(
    conflicts.map(async (conflict) => {
      const normalizedLocal = normalizeValue(conflict.localValue);
      const normalizedRemote = normalizeValue(conflict.remoteValue);

      if (normalizedLocal === normalizedRemote) {
        await prisma.registryConflict.updateMany({
          where: {
            userId: conflict.userId,
            itemId: conflict.itemId,
            field: conflict.field,
            resolved: false,
          },
          data: { resolved: true },
        });
        return;
      }

      const existing = await prisma.registryConflict.findFirst({
        where: {
          userId: conflict.userId,
          itemId: conflict.itemId,
          field: conflict.field,
          resolved: false,
        },
      });

      if (existing) {
        await prisma.registryConflict.update({
          where: { id: existing.id },
          data: {
            localValue: normalizedLocal ?? existing.localValue,
            remoteValue: normalizedRemote ?? existing.remoteValue,
            createdAt: new Date(),
          },
        });
        return;
      }

      await prisma.registryConflict.create({
        data: {
          userId: conflict.userId,
          itemId: conflict.itemId,
          field: conflict.field,
          localValue: normalizedLocal ?? null,
          remoteValue: normalizedRemote ?? null,
        },
      });
    }),
  );
};

export const clearConflict = async ({ userId, itemId, field }: ClearConflictInput) => {
  await prisma.registryConflict.updateMany({
    where: { userId, itemId, field, resolved: false },
    data: { resolved: true },
  });
};

export const listActiveConflicts = async (userId: string) => {
  return prisma.registryConflict.findMany({
    where: { userId, resolved: false },
    include: {
      item: {
        select: {
          id: true,
          title: true,
          productId: true,
          myRegistryId: true,
          status: true,
          url: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getConflictById = async (conflictId: string, userId: string) => {
  return prisma.registryConflict.findFirst({
    where: { id: conflictId, userId },
    include: {
      item: {
        select: {
          id: true,
          title: true,
          myRegistryId: true,
          status: true,
          quantity: true,
          notes: true,
          url: true,
        },
      },
    },
  });
};

export const markConflictResolved = async (conflictId: string) => {
  await prisma.registryConflict.updateMany({
    where: { id: conflictId },
    data: { resolved: true },
  });
};

const buildUpdatePayload = (field: ConflictField, value?: string | null): Prisma.RegistryItemUpdateInput | null => {
  switch (field) {
    case 'quantity': {
      const quantity = parseQuantity(value ?? undefined);
      return typeof quantity === 'number' ? { quantity } : null;
    }
    case 'status': {
      const status = parseStatus(value ?? undefined);
      return status ? { status } : null;
    }
    case 'customNote':
      return { notes: value ?? null };
    case 'affiliateUrl':
      return { url: value ?? '' };
    default:
      return null;
  }
};

export const applyRemoteValue = async (conflictId: string, userId: string) => {
  const conflict = await prisma.registryConflict.findFirst({
    where: { id: conflictId, userId, resolved: false },
  });
  if (!conflict) {
    throw new Error('Conflict not found');
  }

  const data = buildUpdatePayload(conflict.field as ConflictField, conflict.remoteValue ?? null);
  if (!data) {
    await markConflictResolved(conflictId);
    return null;
  }

  const updated = await prisma.registryItem.update({
    where: { id: conflict.itemId },
    data,
    include: { product: true },
  });

  await markConflictResolved(conflictId);
  return updated;
};

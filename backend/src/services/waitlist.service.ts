import { Waitlist } from '@prisma/client';

import { prisma } from '../utils/prisma';

interface JoinPayload {
  email: string;
  name?: string;
}

export const joinWaitlist = async ({ email, name }: JoinPayload) => {
  const existing = await prisma.waitlist.findUnique({ where: { email } });

  if (existing) {
    return existing;
  }

  return prisma.waitlist.create({
    data: {
      email,
      name,
    },
  });
};

export const getPendingWaitlist = async (): Promise<Waitlist[]> => {
  return prisma.waitlist.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
  });
};

export const updateWaitlistStatus = async (id: string, status: 'approved' | 'rejected') => {
  return prisma.waitlist.update({
    where: { id },
    data: { status },
  });
};

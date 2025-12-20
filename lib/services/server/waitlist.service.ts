import { Waitlist } from '@prisma/client';

import { prisma } from '@/lib/prisma';

interface JoinPayload {
  email: string;
  name?: string;
}

interface AddWaitlistPayload {
  email: string;
  name?: string;
  source?: string;
  note?: string;
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

export const addToWaitlist = async (payload: AddWaitlistPayload) => {
  return joinWaitlist({ email: payload.email, name: payload.name });
};

export const getPendingWaitlist = async (): Promise<Waitlist[]> => {
  return prisma.waitlist.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
  });
};

export const getWaitlist = async (): Promise<Waitlist[]> => {
  return prisma.waitlist.findMany({
    orderBy: { createdAt: 'asc' },
  });
};

export const updateWaitlistStatus = async (id: string, status: 'approved' | 'rejected') => {
  return prisma.waitlist.update({
    where: { id },
    data: { status },
  });
};

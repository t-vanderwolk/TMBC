import type { Role } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export interface LogLoginAttemptInput {
  user?: { id: string; role?: Role | null } | null;
  email: string;
  role?: Role | null;
  success: boolean;
  ip?: string | null;
  userAgent?: string | null;
}

export async function logLoginAttempt({
  user,
  email,
  role,
  success,
  ip,
  userAgent,
}: LogLoginAttemptInput) {
  return prisma.loginEvent.create({
    data: {
      userId: user?.id,
      email,
      role: role ?? user?.role,
      success,
      ip,
      userAgent,
    },
  });
}

export const getLoginEvents = async (limit = 200) => {
  return prisma.loginEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};

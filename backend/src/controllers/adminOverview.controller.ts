import { Request, Response, NextFunction } from 'express';

import { prisma } from '../../prisma/client';

export const getAdminOverviewController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, mentorCount, pendingInvites, registryItems] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.inviteRequest.count({
        where: {
          status: {
            equals: 'PENDING',
            mode: 'insensitive',
          },
        },
      }),
      prisma.registryItem.count(),
    ]);

    res.json({ totalUsers, mentorCount, pendingInvites, registryItems });
  } catch (error) {
    next(error);
  }
};

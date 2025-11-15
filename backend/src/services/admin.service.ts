import { prisma } from '../utils/prisma';

export const getAdminDashboard = async () => {
  const [userCount, inviteCount, usedInviteCount] = await Promise.all([
    prisma.user.count(),
    prisma.invite.count(),
    prisma.invite.count({ where: { used: true } }),
  ]);

  return {
    totals: {
      users: userCount,
      invites: inviteCount,
      usedInvites: usedInviteCount,
    },
  };
};

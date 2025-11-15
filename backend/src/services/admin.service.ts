import { prisma } from '../utils/prisma';
import {
  getPendingWaitlist,
  updateWaitlistStatus,
} from './waitlist.service';

export const getAdminAnalytics = async () => {
  const [userCount, inviteCount, usedInviteCount, mentorCount] = await Promise.all([
    prisma.user.count(),
    prisma.invite.count(),
    prisma.invite.count({ where: { used: true } }),
    prisma.user.count({ where: { role: 'MENTOR' } }),
  ]);

  return {
    totals: {
      users: userCount,
      invites: inviteCount,
      usedInvites: usedInviteCount,
      mentors: mentorCount,
    },
    // TODO: replace placeholder growth stats with analytics service
    growth: {
      invitesWeekOverWeek: 12,
      waitlistDelta: -5,
    },
  };
};

export const getAdminWaitlistEntries = async () => {
  // TODO: filter + paginate waitlist entries once volume grows
  return getPendingWaitlist();
};

export const approveWaitlistEntry = async (id: string) => {
  // TODO: trigger onboarding email + automation
  return updateWaitlistStatus(id, 'approved');
};

export const rejectWaitlistEntry = async (id: string) => {
  // TODO: trigger gentle rejection email
  return updateWaitlistStatus(id, 'rejected');
};

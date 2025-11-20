"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectWaitlistEntry = exports.approveWaitlistEntry = exports.getAdminWaitlistEntries = exports.getAdminAnalytics = void 0;
const prisma_1 = require("../utils/prisma");
const waitlist_service_1 = require("./waitlist.service");
const getAdminAnalytics = async () => {
    const [userCount, inviteCount, usedInviteCount, mentorCount] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.invite.count(),
        prisma_1.prisma.invite.count({ where: { used: true } }),
        prisma_1.prisma.user.count({ where: { role: 'MENTOR' } }),
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
exports.getAdminAnalytics = getAdminAnalytics;
const getAdminWaitlistEntries = async () => {
    // TODO: filter + paginate waitlist entries once volume grows
    return (0, waitlist_service_1.getPendingWaitlist)();
};
exports.getAdminWaitlistEntries = getAdminWaitlistEntries;
const approveWaitlistEntry = async (id) => {
    // TODO: trigger onboarding email + automation
    return (0, waitlist_service_1.updateWaitlistStatus)(id, 'approved');
};
exports.approveWaitlistEntry = approveWaitlistEntry;
const rejectWaitlistEntry = async (id) => {
    // TODO: trigger gentle rejection email
    return (0, waitlist_service_1.updateWaitlistStatus)(id, 'rejected');
};
exports.rejectWaitlistEntry = rejectWaitlistEntry;

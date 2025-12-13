"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorMentees = exports.getMentorOverview = exports.getMentorSummaries = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("../../prisma/client");
const getMentorSummaries = async () => {
    const mentors = await client_2.prisma.user.findMany({
        where: { role: client_1.Role.MENTOR },
        include: {
            invites: {
                where: { used: true },
            },
        },
    });
    return mentors.map((mentor) => ({
        id: mentor.id,
        name: mentor.name,
        mentees: mentor.invites.length,
    }));
};
exports.getMentorSummaries = getMentorSummaries;
const getMentorOverview = async (mentorId) => {
    // TODO: Replace placeholder stats with Prisma analytics (registry reviews, check-ins, etc.)
    const mentees = await (0, exports.getMentorMentees)(mentorId);
    return {
        menteeCount: mentees.length,
        pendingRegistryReviews: mentees.filter((mentee) => mentee.registryStatus === 'Needs feedback').length,
        upcomingTouchpoints: [
            { mentee: mentees[0]?.name || 'TBD', date: 'Thu · 3pm CST', topic: 'Nursery review' },
        ],
    };
};
exports.getMentorOverview = getMentorOverview;
const getMentorMentees = async (mentorId) => {
    // TODO: Query mentees assigned to mentor via Prisma relations
    return [
        {
            id: 'mentee-1',
            name: 'Taylor V.',
            dueDate: '2024-07-12',
            focus: 'Nursery styling',
            registryStatus: 'Needs feedback',
            mentorId,
        },
        {
            id: 'mentee-2',
            name: 'Morgan A.',
            dueDate: '2024-08-03',
            focus: 'Feeding plan',
            registryStatus: 'Approved',
            mentorId,
        },
    ];
};
exports.getMentorMentees = getMentorMentees;

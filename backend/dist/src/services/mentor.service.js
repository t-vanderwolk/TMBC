"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorMemberOverview = exports.getMentorNotes = exports.getMentorMentees = exports.getMentorOverview = exports.getMentorUpcomingEvents = exports.getMentorJournalNeeds = exports.getMentorTasks = exports.getMentorSummaries = void 0;
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
const getMentorTasks = async (_mentorId) => {
    return [
        { id: 't1', type: 'Registry', title: 'Review crib options', member: 'Elena', due: '2025-12-10' },
        { id: 't2', type: 'Academy', title: 'Approve module recap', member: 'Wren', due: '2025-12-12' },
        { id: 't3', type: 'Check-in', title: 'Follow up on feeding', member: 'Noor', due: '2025-12-14' },
        { id: 't4', type: 'Product', title: 'Flag stroller duplicates', member: 'Morgan', due: '2025-12-15' },
        { id: 't5', type: 'Journal', title: 'Encourage postpartum ritual', member: 'Elena', due: '2025-12-17' },
    ];
};
exports.getMentorTasks = getMentorTasks;
const getMentorJournalNeeds = async (_mentorId) => {
    return [
        {
            id: 'j1',
            member: 'Elena',
            preview: 'Just finished my nursery vision board and would love your notes on the lighting ',
            updatedAt: 'Dec 1 · 2:15 PM',
        },
        {
            id: 'j2',
            member: 'Wren',
            preview: 'Feeling overwhelmed about packing the hospital bag. What should stay in reach?',
            updatedAt: 'Dec 1 · 9:42 AM',
        },
        {
            id: 'j3',
            member: 'Morgan',
            preview: 'Quick pulse: feeding time is unpredictable—any rituals help calm Nora?',
            updatedAt: 'Nov 30 · 6:12 PM',
        },
    ];
};
exports.getMentorJournalNeeds = getMentorJournalNeeds;
const getMentorUpcomingEvents = async (_mentorId) => {
    return [
        { id: 'c1', title: 'Fourth Trimester Circle', type: 'Circle', time: 'Thu · 12pm CST', rsvpCount: 14 },
        { id: 'c2', title: 'Mentor Review Salon', type: 'Salon', time: 'Mon · 4pm CST', rsvpCount: 8 },
        { id: 'c3', title: '1:1 Concierge Check-in', type: 'Session', time: 'Tue · 10am CST', rsvpCount: 3 },
    ];
};
exports.getMentorUpcomingEvents = getMentorUpcomingEvents;
const getMentorOverview = async (mentorId) => {
    const mentees = await (0, exports.getMentorMentees)(mentorId);
    const journals = await (0, exports.getMentorJournalNeeds)(mentorId);
    const tasks = await (0, exports.getMentorTasks)(mentorId);
    return {
        mentees: mentees.length,
        journalsAwaiting: journals.length,
        pendingTasks: tasks.length,
    };
};
exports.getMentorOverview = getMentorOverview;
const getMentorMentees = async (mentorId) => {
    const members = await client_2.prisma.user.findMany({
        where: { role: client_1.Role.MEMBER },
        include: {
            profile: true,
            registryItems: {
                select: {
                    id: true,
                },
                take: 1,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 12,
    });
    const safeMembers = members.filter((member) => member.role === client_1.Role.MEMBER);
    return safeMembers.map((member) => {
        const dueDate = member.profile?.dueDate
            ? member.profile.dueDate.toISOString().split('T')[0]
            : 'TBD';
        const needsRegistry = (member.registryItems?.length ?? 0) < 3;
        return {
            id: member.id,
            name: member.name ?? 'Friend',
            dueDate,
            focus: needsRegistry ? 'Finish registry checklist' : 'Keep iterating on progress',
            registryStatus: needsRegistry ? 'Needs essentials' : 'On track',
            mentorId,
            trimester: member.profile?.dueDate ? 'Third trimester' : 'Planning',
            lastInteraction: member.updatedAt.toISOString(),
        };
    });
};
exports.getMentorMentees = getMentorMentees;
const memberOverviewData = {
    'mentee-1': {
        memberId: 'mentee-1',
        name: 'Taylor Vanderwolk',
        stage: 'Mother-to-be · Third trimester',
        focus: 'Nursery styling + registry rhythm',
        mentorName: 'Ellie',
        mentorId: 'mentor-1',
        modules: [
            { title: 'Car Seat Couture', progress: 55, note: 'Ellie says: trust the recline and breathe through the install.' },
            { title: 'Moodboard Lighting', progress: 20, note: 'Registry stylist tip: keep the glow soft and rewind two shades.' },
            { title: 'Gear Flow Registry', progress: 35, note: 'Lean into capsule pieces and skip the wipe warmer parade.' },
        ],
        registryHighlights: [
            { title: 'Linen Nest Set', note: 'Suggested skipping extra bedding layers—focus on blush textures.' },
            { title: 'Nursery Reading Lamp', note: 'Mentor asked for lower warmth and a dimmer note.' },
            { title: 'Minimalist Bassinet', note: 'Reminder: confirm delivery timeline during next check-in.' },
        ],
        events: [
            { title: 'Fourth Trimester Circle', date: 'Thu · 12pm CST', note: 'Invite Taylor to share her lighting board.' },
            { title: 'Mentor Review Salon', date: 'Mon · 4pm CST', note: 'Mentor wants to highlight registry edits.' },
        ],
        mentorNotes: [
            'Reminder: share the “tea + gratitude” ritual before tonight’s chat.',
            'Drop a voice note about the car seat ritual progress.',
            'Flag the linen basket for a quick registry review.',
        ],
    },
    'mentee-2': {
        memberId: 'mentee-2',
        name: 'Morgan Avery',
        stage: 'Mother-to-be · Trimester 2',
        focus: 'Feeding plan + postpartum rhythm',
        mentorName: 'Ellie',
        mentorId: 'mentor-1',
        modules: [
            { title: 'Postpartum Breathwork', progress: 40, note: 'Encourage 5 mins of breathwork twice daily.' },
            { title: 'Closet Edit Registry', progress: 60, note: 'Swap the bulky set for curated capsule vibes.' },
        ],
        registryHighlights: [
            { title: 'Feeding Chair', note: 'Please confirm fabric swatches before purchase.' },
            { title: 'Style Capsule Set', note: 'Mentor curated colors for calming evenings.' },
        ],
        events: [
            { title: 'Feeding Confidence Salon', date: 'Wed · 9am CST', note: 'Morgan asked for a quick pre-call record.' },
        ],
        mentorNotes: [
            'Share the updated feeding plan doc in their inbox.',
            'Ask Morgan about how the capsule colors land in her space.',
        ],
    },
    'mentee-3': {
        memberId: 'mentee-3',
        name: 'Noor Halim',
        stage: 'Mother-to-be · Trimester 3',
        focus: 'Postpartum reset + rituals',
        mentorName: 'Ellie',
        mentorId: 'mentor-1',
        modules: [
            { title: 'Postpartum Planning', progress: 25, note: 'Build a 10-min reset ritual for late afternoons.' },
            { title: 'Moodboard Reflection', progress: 15, note: 'Add gratitude prompts before journaling.' },
        ],
        registryHighlights: [
            { title: 'Calm Carrier', note: 'Mentor asked to compare weight with current models.' },
        ],
        events: [
            { title: 'Postpartum Reset Circle', date: 'Fri · 5pm CST', note: 'Noor is excited to share her notebook.' },
        ],
        mentorNotes: [
            'Encourage Noor to journal about her reset rituals.',
            'Double-check RSVP for the Postpartum Reset Circle.',
        ],
    },
};
const getMentorNotes = async (mentorId) => {
    const notes = await client_2.prisma.mentorNote.findMany({
        where: { mentorId },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
            member: { select: { id: true, name: true } },
            module: { select: { title: true } },
        },
    });
    return notes.map((note) => ({
        id: note.id,
        memberId: note.memberId,
        memberName: note.member?.name || null,
        moduleTitle: note.module?.title ?? null,
        snippet: note.content,
        createdAt: note.createdAt.toISOString(),
    }));
};
exports.getMentorNotes = getMentorNotes;
const getMentorMemberOverview = async (mentorId, memberId) => {
    const candidate = memberOverviewData[memberId];
    if (candidate) {
        return candidate;
    }
    return {
        memberId,
        name: 'Member',
        stage: 'N/A',
        focus: 'Onboarding rhythm',
        mentorName: 'Ellie',
        mentorId: 'mentor-1',
        modules: [
            { title: 'Foundations', progress: 0, note: 'Starting fresh' },
        ],
        registryHighlights: [],
        events: [],
        mentorNotes: ['Mentor will update this view soon.'],
    };
};
exports.getMentorMemberOverview = getMentorMemberOverview;

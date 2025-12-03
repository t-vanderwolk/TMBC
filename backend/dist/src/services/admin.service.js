"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectWaitlistEntry = exports.approveWaitlistEntry = exports.getAdminWaitlistEntries = exports.updateAdminSettings = exports.getAdminSettings = exports.updateAdminModule = exports.getAdminModules = exports.getAdminRegistryMonitor = exports.deleteAdminEvent = exports.updateAdminEvent = exports.createAdminEvent = exports.getAdminEvents = exports.updateAdminMentor = exports.getAdminMentors = exports.deleteAdminUser = exports.updateAdminUser = exports.getAdminUsers = exports.getAdminStats = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("../../prisma/client");
const waitlist_service_1 = require("./waitlist.service");
const RELATIVE_BUCKETS = [
    { limit: 60, label: (value) => `${value}m ago` },
    { limit: 1440, label: (value) => `${Math.floor(value / 60)}h ago` },
    { limit: Infinity, label: (value) => `${Math.floor(value / 1440)}d ago` },
];
const formatRelativeTime = (date) => {
    const minutesAgo = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
    for (const bucket of RELATIVE_BUCKETS) {
        if (minutesAgo < bucket.limit) {
            return bucket.label(minutesAgo);
        }
    }
    return 'just now';
};
const PURCHASED_STATUSES = ['PURCHASED', 'PURCHASED_ELSEWHERE'];
const normalizeModuleContent = (value) => {
    if (!value || typeof value !== 'object') {
        return {};
    }
    return value;
};
const getAdminStats = async () => {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const [membersCount, mentorsCount, registryCount, activeEvents] = await Promise.all([
        client_2.prisma.user.count({ where: { role: client_1.Role.MEMBER } }),
        client_2.prisma.user.count({ where: { role: client_1.Role.MENTOR } }),
        client_2.prisma.registryItem.count(),
        client_2.prisma.event.count({ where: { status: { in: ['published', 'scheduled'] } } }),
    ]);
    const todaysSignups = await client_2.prisma.user.count({
        where: {
            createdAt: {
                gte: todayStart,
            },
        },
    });
    const signupsSeriesRows = await client_2.prisma.$queryRaw `SELECT TO_CHAR(day, 'Mon DD') AS "date", count FROM (
      SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*) AS count
      FROM "User"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
    ) sub;`;
    const signupsSeries = signupsSeriesRows.map((row) => ({
        date: row.date,
        count: Number(row.count),
    }));
    const registrySeriesRows = await client_2.prisma.$queryRaw `SELECT COALESCE("moduleCode", 'untracked') AS "moduleCode", COUNT(*) AS count
      FROM "RegistryItem"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY "moduleCode"
      ORDER BY count DESC
      LIMIT 6;`;
    const moduleCodes = Array.from(new Set(registrySeriesRows.map((row) => row.moduleCode).filter(Boolean)));
    const modules = moduleCodes.length
        ? await client_2.prisma.academyModule.findMany({
            where: { id: { in: moduleCodes } },
        })
        : [];
    const moduleNameMap = new Map(modules.map((module) => [module.id, module.title]));
    const registrySeries = registrySeriesRows.map((row) => ({
        label: moduleNameMap.get(row.moduleCode ?? '') ?? row.moduleCode ?? 'untracked',
        count: Number(row.count),
    }));
    const [mentorNotes, registryItems, events] = await Promise.all([
        client_2.prisma.mentorNote.findMany({
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: {
                mentor: { select: { name: true } },
                member: { select: { name: true } },
            },
        }),
        client_2.prisma.registryItem.findMany({
            orderBy: { updatedAt: 'desc' },
            take: 3,
            include: {
                user: { select: { name: true } },
            },
        }),
        client_2.prisma.event.findMany({
            orderBy: { updatedAt: 'desc' },
            take: 3,
        }),
    ]);
    const activities = [
        ...mentorNotes.map((note) => ({
            id: `note-${note.id}`,
            summary: `${note.mentor?.name ?? 'Mentor'} shared feedback for ${note.member?.name ?? 'a member'}`,
            timestamp: formatRelativeTime(note.createdAt),
            created: note.createdAt,
        })),
        ...registryItems.map((item) => ({
            id: `registry-${item.id}`,
            summary: `${item.user?.name ?? 'Member'} updated registry item ${item.title}`,
            timestamp: formatRelativeTime(item.updatedAt),
            created: item.updatedAt,
        })),
        ...events.map((event) => ({
            id: `event-${event.id}`,
            summary: `Event "${event.title}" status is ${event.status}`,
            timestamp: formatRelativeTime(event.updatedAt),
            created: event.updatedAt,
        })),
    ];
    const systemActivity = activities
        .sort((a, b) => b.created.getTime() - a.created.getTime())
        .slice(0, 5)
        .map((activity) => ({
        id: activity.id,
        summary: activity.summary,
        timestamp: activity.timestamp,
    }));
    return {
        totalMembers: membersCount,
        totalMentors: mentorsCount,
        activeEvents,
        totalRegistryItems: registryCount,
        todaysSignups,
        signupsSeries,
        registrySeries,
        systemActivity,
    };
};
exports.getAdminStats = getAdminStats;
const getAdminUsers = async () => {
    const users = await client_2.prisma.user.findMany({
        include: {
            consumedInvite: { select: { code: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => ({
        id: user.id,
        name: user.name ?? user.email,
        email: user.email,
        role: user.role.toLowerCase(),
        inviteCode: user.consumedInvite?.code ?? undefined,
        joinedAt: user.createdAt.toISOString(),
        status: user.disabled ? 'disabled' : 'active',
    }));
};
exports.getAdminUsers = getAdminUsers;
const updateAdminUser = async (id, payload) => {
    const data = {};
    if (payload.role) {
        data.role = payload.role.toUpperCase();
    }
    if (payload.status) {
        data.disabled = payload.status === 'disabled';
    }
    if (payload.name) {
        data.name = payload.name;
    }
    return client_2.prisma.user.update({
        where: { id },
        data,
    });
};
exports.updateAdminUser = updateAdminUser;
const deleteAdminUser = async (id) => {
    return client_2.prisma.user.delete({
        where: { id },
    });
};
exports.deleteAdminUser = deleteAdminUser;
const getAdminMentors = async () => {
    const mentors = await client_2.prisma.user.findMany({
        where: { role: client_1.Role.MENTOR },
        select: {
            id: true,
            name: true,
            updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
    });
    const feedbackGroups = await client_2.prisma.mentorFeedback.groupBy({
        by: ['mentorId'],
        _count: { _all: true },
    });
    const noteGroups = await client_2.prisma.mentorNote.groupBy({
        by: ['mentorId'],
        _count: { _all: true },
    });
    const eventGroups = await client_2.prisma.event.groupBy({
        by: ['hostId'],
        _count: { _all: true },
    });
    const menteeRows = await client_2.prisma.$queryRaw `
    SELECT "mentorId", COUNT(DISTINCT "memberId") AS mentees
    FROM "MentorNote"
    GROUP BY "mentorId";
  `;
    const feedbackMap = new Map(feedbackGroups.map((row) => [row.mentorId, row._count._all]));
    const noteMap = new Map(noteGroups.map((row) => [row.mentorId, row._count._all]));
    const eventMap = new Map(eventGroups.map((row) => [row.hostId, row._count._all]));
    const menteeMap = new Map(menteeRows.map((row) => [row.mentorId, Number(row.mentees)]));
    return mentors.map((mentor) => ({
        id: mentor.id,
        name: mentor.name ?? 'Mentor',
        mentees: menteeMap.get(mentor.id) ?? 0,
        performance: {
            workbookFeedback: feedbackMap.get(mentor.id) ?? 0,
            registryNotes: noteMap.get(mentor.id) ?? 0,
            eventsHosted: eventMap.get(mentor.id) ?? 0,
        },
        lastActive: formatRelativeTime(mentor.updatedAt),
    }));
};
exports.getAdminMentors = getAdminMentors;
const updateAdminMentor = async (id, payload) => {
    const data = {};
    if (payload.status) {
        data.disabled = payload.status === 'disabled';
    }
    if (payload.name) {
        data.name = payload.name;
    }
    return client_2.prisma.user.update({
        where: { id },
        data,
    });
};
exports.updateAdminMentor = updateAdminMentor;
const getAdminEvents = async () => {
    const events = await client_2.prisma.event.findMany({
        include: {
            rsvps: true,
        },
        orderBy: { startTime: 'asc' },
    });
    return events.map((event) => ({
        id: event.id,
        name: event.title,
        date: event.startTime.toISOString(),
        location: event.location ?? null,
        status: event.status,
        rsvpCount: event.rsvps.length,
    }));
};
exports.getAdminEvents = getAdminEvents;
const createAdminEvent = async (payload, hostId, hostName) => {
    const startTime = new Date(payload.date);
    if (Number.isNaN(startTime.getTime())) {
        throw new Error('Invalid start date');
    }
    const event = await client_2.prisma.event.create({
        data: {
            title: payload.name,
            location: payload.location,
            description: payload.description,
            status: payload.status ?? 'scheduled',
            type: payload.type,
            format: payload.format,
            startTime,
            endTime: payload.date ? new Date(payload.date) : undefined,
            hostId,
            hostName,
        },
    });
    return {
        id: event.id,
        name: event.title,
        date: event.startTime.toISOString(),
        location: event.location,
        status: event.status,
        rsvpCount: 0,
    };
};
exports.createAdminEvent = createAdminEvent;
const updateAdminEvent = async (id, payload) => {
    const data = {};
    if (payload.name)
        data.title = payload.name;
    if (payload.location !== undefined)
        data.location = payload.location;
    if (payload.description !== undefined)
        data.description = payload.description;
    if (payload.status)
        data.status = payload.status;
    if (payload.type)
        data.type = payload.type;
    if (payload.format)
        data.format = payload.format;
    if (payload.date) {
        const nextDate = new Date(payload.date);
        if (Number.isNaN(nextDate.getTime())) {
            throw new Error('Invalid date');
        }
        data.startTime = nextDate;
        data.endTime = nextDate;
    }
    const event = await client_2.prisma.event.update({
        where: { id },
        data,
        include: { rsvps: true },
    });
    return {
        id: event.id,
        name: event.title,
        date: event.startTime.toISOString(),
        location: event.location,
        status: event.status,
        rsvpCount: event.rsvps.length,
    };
};
exports.updateAdminEvent = updateAdminEvent;
const deleteAdminEvent = async (id) => {
    await client_2.prisma.event.delete({ where: { id } });
    return { id };
};
exports.deleteAdminEvent = deleteAdminEvent;
const getAdminRegistryMonitor = async () => {
    const entries = await client_2.prisma.registryItem.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
            user: { select: { name: true, email: true } },
        },
    });
    const latestEntries = entries.map((entry) => ({
        id: entry.id,
        userName: entry.user?.name ?? entry.user?.email ?? 'Member',
        merchant: entry.merchant ?? 'Unknown',
        productTitle: entry.title,
        moduleId: entry.moduleCode,
        purchased: PURCHASED_STATUSES.includes(entry.status),
        createdAt: entry.createdAt.toISOString(),
    }));
    const filters = Array.from(new Set(entries.map((entry) => entry.merchant ?? 'Unknown'))).map((merchant) => ({
        label: merchant,
        value: merchant,
    }));
    const affiliateRows = await client_2.prisma.$queryRaw `SELECT COALESCE("merchant", 'Unknown') AS merchant, SUM(COALESCE("price", 0) * "quantity") AS revenue
      FROM "RegistryItem"
      WHERE "status" IN ('PURCHASED', 'PURCHASED_ELSEWHERE')
      GROUP BY merchant
      ORDER BY revenue DESC
      LIMIT 6;`;
    const affiliateSummary = affiliateRows.map((row) => ({
        label: row.merchant ?? 'Unknown',
        revenue: Number(row.revenue ?? 0),
    }));
    return {
        latestEntries,
        filters,
        affiliateSummary,
    };
};
exports.getAdminRegistryMonitor = getAdminRegistryMonitor;
const getAdminModules = async () => {
    const modules = await client_2.prisma.academyModule.findMany({
        orderBy: { updatedAt: 'desc' },
    });
    return modules.map((module) => {
        const content = normalizeModuleContent(module.content);
        return {
            id: module.id,
            code: module.id,
            title: module.title,
            subtitle: module.subtitle ?? '',
            heroImage: module.heroImage ?? '',
            lecture: content.lecture ?? '',
            explore: content.explore ?? '',
            apply: content.apply ?? '',
            journalPrompt: content.journalPrompt ?? '',
            updatedAt: module.updatedAt.toISOString(),
        };
    });
};
exports.getAdminModules = getAdminModules;
const updateAdminModule = async (id, payload) => {
    const existingModule = await client_2.prisma.academyModule.findUniqueOrThrow({ where: { id } });
    const existingContent = normalizeModuleContent(existingModule.content);
    const contentUpdates = {};
    const data = {};
    if (payload.title)
        data.title = payload.title;
    if (payload.subtitle !== undefined)
        data.subtitle = payload.subtitle;
    if (payload.heroImage !== undefined)
        data.heroImage = payload.heroImage;
    if (payload.lecture !== undefined)
        contentUpdates.lecture = payload.lecture;
    if (payload.explore !== undefined)
        contentUpdates.explore = payload.explore;
    if (payload.apply !== undefined)
        contentUpdates.apply = payload.apply;
    if (payload.journalPrompt !== undefined)
        contentUpdates.journalPrompt = payload.journalPrompt;
    if (Object.keys(contentUpdates).length > 0) {
        data.content = {
            ...existingContent,
            ...contentUpdates,
        };
    }
    const module = await client_2.prisma.academyModule.update({
        where: { id },
        data,
    });
    const updatedContent = normalizeModuleContent(module.content);
    return {
        id: module.id,
        code: module.id,
        title: module.title,
        subtitle: module.subtitle ?? '',
        heroImage: module.heroImage ?? '',
        lecture: updatedContent.lecture ?? '',
        explore: updatedContent.explore ?? '',
        apply: updatedContent.apply ?? '',
        journalPrompt: updatedContent.journalPrompt ?? '',
        updatedAt: module.updatedAt.toISOString(),
    };
};
exports.updateAdminModule = updateAdminModule;
const getAdminSettings = async () => {
    const settings = await client_2.prisma.adminSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {},
    });
    return {
        inviteOnly: settings.inviteOnly,
        defaultMentorId: settings.defaultMentorId ?? undefined,
        pinterestClientId: settings.pinterestClientId ?? undefined,
        pinterestClientSecret: settings.pinterestSecret ?? undefined,
        myRegistryMerchantId: settings.myRegistryMerchantId ?? undefined,
        affiliateNetwork: settings.affiliateNetwork ?? undefined,
    };
};
exports.getAdminSettings = getAdminSettings;
const updateAdminSettings = async (payload) => {
    const data = {};
    if (payload.inviteOnly !== undefined)
        data.inviteOnly = payload.inviteOnly;
    if (payload.defaultMentorId !== undefined)
        data.defaultMentorId = payload.defaultMentorId;
    if (payload.pinterestClientId !== undefined)
        data.pinterestClientId = payload.pinterestClientId;
    if (payload.pinterestClientSecret !== undefined)
        data.pinterestSecret = payload.pinterestClientSecret;
    if (payload.myRegistryMerchantId !== undefined)
        data.myRegistryMerchantId = payload.myRegistryMerchantId;
    if (payload.affiliateNetwork !== undefined)
        data.affiliateNetwork = payload.affiliateNetwork;
    const settings = await client_2.prisma.adminSettings.upsert({
        where: { id: 1 },
        update: data,
        create: {
            inviteOnly: payload.inviteOnly ?? true,
            defaultMentorId: payload.defaultMentorId,
            pinterestClientId: payload.pinterestClientId,
            pinterestSecret: payload.pinterestClientSecret,
            myRegistryMerchantId: payload.myRegistryMerchantId,
            affiliateNetwork: payload.affiliateNetwork,
        },
    });
    return {
        inviteOnly: settings.inviteOnly,
        defaultMentorId: settings.defaultMentorId ?? undefined,
        pinterestClientId: settings.pinterestClientId ?? undefined,
        pinterestClientSecret: settings.pinterestSecret ?? undefined,
        myRegistryMerchantId: settings.myRegistryMerchantId ?? undefined,
        affiliateNetwork: settings.affiliateNetwork ?? undefined,
    };
};
exports.updateAdminSettings = updateAdminSettings;
const getAdminWaitlistEntries = async () => {
    return (0, waitlist_service_1.getPendingWaitlist)();
};
exports.getAdminWaitlistEntries = getAdminWaitlistEntries;
const approveWaitlistEntry = async (id) => {
    return (0, waitlist_service_1.updateWaitlistStatus)(id, 'approved');
};
exports.approveWaitlistEntry = approveWaitlistEntry;
const rejectWaitlistEntry = async (id) => {
    return (0, waitlist_service_1.updateWaitlistStatus)(id, 'rejected');
};
exports.rejectWaitlistEntry = rejectWaitlistEntry;

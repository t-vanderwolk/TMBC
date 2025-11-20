"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedJournalEntries = exports.shareJournalEntry = exports.getTasksForMember = exports.getTasksForMentor = exports.completeTask = exports.createTask = exports.getFeedbackForMember = exports.addMentorFeedback = exports.getMemberProfileForMentor = exports.getMenteeList = exports.getMentorOverview = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const registry_service_1 = require("./registry.service");
const journal_service_1 = require("./journal.service");
const handleError = (error, fallback = 'Mentor collaboration service error') => {
    const message = typeof error?.message === 'string' ? error.message : fallback;
    return { ok: false, error: message };
};
const mapFeedback = (feedback) => ({
    id: feedback.id,
    message: feedback.message,
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
    mentor: feedback.mentor ? { id: feedback.mentor.id, name: feedback.mentor.name } : null,
    member: feedback.member ? { id: feedback.member.id, name: feedback.member.name } : null,
    module: feedback.module ? { id: feedback.module.id, title: feedback.module.title } : null,
    registryItem: feedback.registryItem ? { id: feedback.registryItem.id, title: feedback.registryItem.title } : null,
});
const fetchMenteesViaInvites = async (mentorId) => {
    const invites = await prisma_1.prisma.invite.findMany({
        where: { createdById: mentorId, used: true },
        include: { usedBy: { select: { id: true, name: true, email: true, createdAt: true } } },
    });
    const mentees = invites
        .map((invite) => invite.usedBy)
        .filter((user) => Boolean(user));
    return mentees.map((mentee) => ({
        id: mentee.id,
        name: mentee.name,
        email: mentee.email,
        onboardedAt: mentee.createdAt,
    }));
};
const fetchSharedJournalEntries = async (mentorId, memberId) => {
    const shares = await prisma_1.prisma.journalShare.findMany({
        where: { mentorId, memberId, allowed: true },
        orderBy: { createdAt: 'desc' },
    });
    if (!shares.length) {
        return [];
    }
    const memberEntries = await (0, journal_service_1.listJournalEntries)(memberId);
    const entryMap = new Map(memberEntries.map((entry) => [entry.id, entry]));
    return shares.map((share) => {
        const entry = entryMap.get(share.journalId);
        return {
            shareId: share.id,
            journalId: share.journalId,
            sharedAt: share.createdAt,
            excerpt: entry ? entry.content.slice(0, 140) : '',
        };
    });
};
const getMentorOverview = async (mentorId) => {
    try {
        const [tasks, feedback, mentees] = await Promise.all([
            prisma_1.prisma.mentorTask.findMany({
                where: { mentorId, completed: false },
                orderBy: { createdAt: 'asc' },
            }),
            prisma_1.prisma.mentorFeedback.findMany({
                where: { mentorId },
                include: {
                    member: { select: { id: true, name: true } },
                    module: { select: { id: true, title: true } },
                    registryItem: { select: { id: true, title: true } },
                    mentor: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            fetchMenteesViaInvites(mentorId),
        ]);
        const overview = {
            menteeCount: mentees.length,
            pendingTasks: tasks.length,
            recentFeedback: feedback.map(mapFeedback),
            spotlightMentees: mentees.slice(0, 3),
        };
        return { ok: true, data: overview };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getMentorOverview = getMentorOverview;
const getMenteeList = async (mentorId) => {
    try {
        const mentees = await fetchMenteesViaInvites(mentorId);
        if (mentees.length) {
            return { ok: true, data: mentees };
        }
        const fallbackMembers = await prisma_1.prisma.user.findMany({
            where: { role: client_1.Role.MEMBER },
            select: { id: true, name: true, email: true, createdAt: true },
            take: 5,
        });
        return {
            ok: true,
            data: fallbackMembers.map((member) => ({
                id: member.id,
                name: member.name,
                email: member.email,
                onboardedAt: member.createdAt,
            })),
        };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getMenteeList = getMenteeList;
const getMemberProfileForMentor = async (mentorId, memberId) => {
    try {
        const member = await prisma_1.prisma.user.findUnique({
            where: { id: memberId },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        if (!member) {
            return { ok: false, error: 'Member not found' };
        }
        const [tasks, feedback, registryItems, sharedJournal] = await Promise.all([
            prisma_1.prisma.mentorTask.findMany({
                where: { mentorId, memberId },
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.mentorFeedback.findMany({
                where: { mentorId, memberId },
                include: {
                    mentor: { select: { id: true, name: true } },
                    member: { select: { id: true, name: true } },
                    module: { select: { id: true, title: true } },
                    registryItem: { select: { id: true, title: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            (0, registry_service_1.listRegistryItems)(memberId, mentorId),
            fetchSharedJournalEntries(mentorId, memberId),
        ]);
        return {
            ok: true,
            data: {
                member,
                tasks,
                feedback: feedback.map(mapFeedback),
                registryItems,
                sharedJournal,
            },
        };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getMemberProfileForMentor = getMemberProfileForMentor;
const addMentorFeedback = async ({ mentorId, memberId, moduleId, registryItemId, message }) => {
    try {
        const entry = await prisma_1.prisma.mentorFeedback.create({
            data: { mentorId, memberId, moduleId, registryItemId, message },
            include: {
                mentor: { select: { id: true, name: true } },
                member: { select: { id: true, name: true } },
                module: { select: { id: true, title: true } },
                registryItem: { select: { id: true, title: true } },
            },
        });
        return { ok: true, data: mapFeedback(entry) };
    }
    catch (error) {
        return handleError(error, 'Unable to save mentor feedback');
    }
};
exports.addMentorFeedback = addMentorFeedback;
const getFeedbackForMember = async (memberId, registryItemId, moduleId) => {
    try {
        const feedback = await prisma_1.prisma.mentorFeedback.findMany({
            where: {
                memberId,
                ...(registryItemId ? { registryItemId } : {}),
                ...(moduleId ? { moduleId } : {}),
            },
            include: {
                mentor: { select: { id: true, name: true } },
                member: { select: { id: true, name: true } },
                module: { select: { id: true, title: true } },
                registryItem: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { ok: true, data: feedback.map(mapFeedback) };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getFeedbackForMember = getFeedbackForMember;
const createTask = async ({ mentorId, memberId, type, referenceId, title, description }) => {
    try {
        const task = await prisma_1.prisma.mentorTask.create({
            data: { mentorId, memberId, type, referenceId, title, description },
        });
        return { ok: true, data: task };
    }
    catch (error) {
        return handleError(error, 'Unable to create task');
    }
};
exports.createTask = createTask;
const completeTask = async (taskId) => {
    try {
        const task = await prisma_1.prisma.mentorTask.update({
            where: { id: taskId },
            data: { completed: true },
        });
        return { ok: true, data: task };
    }
    catch (error) {
        return handleError(error, 'Unable to complete task');
    }
};
exports.completeTask = completeTask;
const getTasksForMentor = async (mentorId) => {
    try {
        const tasks = await prisma_1.prisma.mentorTask.findMany({
            where: { mentorId },
            orderBy: { createdAt: 'desc' },
        });
        return { ok: true, data: tasks };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getTasksForMentor = getTasksForMentor;
const getTasksForMember = async (memberId) => {
    try {
        const tasks = await prisma_1.prisma.mentorTask.findMany({
            where: { memberId, completed: false },
            orderBy: { createdAt: 'asc' },
        });
        return { ok: true, data: tasks };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getTasksForMember = getTasksForMember;
const shareJournalEntry = async ({ journalId, memberId, mentorId, allowed = true }) => {
    try {
        const existing = await prisma_1.prisma.journalShare.findFirst({
            where: { journalId, memberId, mentorId },
        });
        if (existing) {
            const share = await prisma_1.prisma.journalShare.update({
                where: { id: existing.id },
                data: { allowed },
            });
            return { ok: true, data: share };
        }
        const share = await prisma_1.prisma.journalShare.create({
            data: { journalId, memberId, mentorId, allowed },
        });
        return { ok: true, data: share };
    }
    catch (error) {
        return handleError(error, 'Unable to update journal share');
    }
};
exports.shareJournalEntry = shareJournalEntry;
const getSharedJournalEntries = async (mentorId, memberId) => {
    try {
        const entries = await fetchSharedJournalEntries(mentorId, memberId);
        return { ok: true, data: entries };
    }
    catch (error) {
        return handleError(error);
    }
};
exports.getSharedJournalEntries = getSharedJournalEntries;

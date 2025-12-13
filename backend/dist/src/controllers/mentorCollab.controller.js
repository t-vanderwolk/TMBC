"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedJournalEntriesController = exports.shareJournalEntryController = exports.getMemberTasksController = exports.getMentorTasksController = exports.completeMentorTaskController = exports.postMentorTaskController = exports.getMemberFeedbackController = exports.postMentorFeedbackController = exports.getMemberProfileController = exports.getMenteeListController = exports.getMentorOverviewController = void 0;
const mentorCollab_service_1 = require("../services/mentorCollab.service");
const getUser = (req) => req.user || {};
const getMentorOverviewController = async (req, res) => {
    const user = getUser(req);
    const mentorId = user?.userId;
    if (!mentorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await (0, mentorCollab_service_1.getMentorOverview)(mentorId);
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.getMentorOverviewController = getMentorOverviewController;
const getMenteeListController = async (req, res) => {
    const mentorId = getUser(req)?.userId;
    if (!mentorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await (0, mentorCollab_service_1.getMenteeList)(mentorId);
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.getMenteeListController = getMenteeListController;
const getMemberProfileController = async (req, res) => {
    const mentorId = getUser(req)?.userId;
    if (!mentorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const result = await (0, mentorCollab_service_1.getMemberProfileForMentor)(mentorId, id);
    return res.status(result.ok ? 200 : 404).json(result);
};
exports.getMemberProfileController = getMemberProfileController;
const postMentorFeedbackController = async (req, res) => {
    const user = getUser(req);
    const { memberId, moduleId, registryItemId, message, mentorId: overrideMentorId } = req.body || {};
    const resolvedMentorId = user.role === 'mentor' ? user.userId : overrideMentorId;
    const resolvedMemberId = user.role === 'member' ? user.userId : memberId;
    if (!resolvedMentorId || !resolvedMemberId || !message) {
        return res.status(400).json({ error: 'mentorId, memberId, and message are required' });
    }
    const result = await (0, mentorCollab_service_1.addMentorFeedback)({
        mentorId: resolvedMentorId,
        memberId: resolvedMemberId,
        moduleId,
        registryItemId,
        message,
    });
    return res.status(result.ok ? 201 : 400).json(result);
};
exports.postMentorFeedbackController = postMentorFeedbackController;
const getMemberFeedbackController = async (req, res) => {
    const user = getUser(req);
    const { memberId } = req.params;
    const registryItemId = typeof req.query.registryItemId === 'string' ? req.query.registryItemId : undefined;
    const moduleId = typeof req.query.moduleId === 'string' ? req.query.moduleId : undefined;
    if (user.role !== 'mentor' && user.userId !== memberId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await (0, mentorCollab_service_1.getFeedbackForMember)(memberId, registryItemId, moduleId);
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.getMemberFeedbackController = getMemberFeedbackController;
const postMentorTaskController = async (req, res) => {
    const mentorId = getUser(req)?.userId;
    if (!mentorId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { memberId, type, referenceId, title, description } = req.body || {};
    if (!memberId || !type || !title) {
        return res.status(400).json({ error: 'memberId, type, and title are required' });
    }
    const result = await (0, mentorCollab_service_1.createTask)({ mentorId, memberId, type, referenceId, title, description });
    return res.status(result.ok ? 201 : 400).json(result);
};
exports.postMentorTaskController = postMentorTaskController;
const completeMentorTaskController = async (req, res) => {
    const mentorId = getUser(req)?.userId;
    if (!mentorId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { taskId } = req.params;
    if (!taskId)
        return res.status(400).json({ error: 'taskId is required' });
    const result = await (0, mentorCollab_service_1.completeTask)(taskId);
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.completeMentorTaskController = completeMentorTaskController;
const getMentorTasksController = async (req, res) => {
    const mentorId = getUser(req)?.userId;
    if (!mentorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await (0, mentorCollab_service_1.getTasksForMentor)(mentorId);
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.getMentorTasksController = getMentorTasksController;
const getMemberTasksController = async (req, res) => {
    const memberId = getUser(req)?.userId;
    if (!memberId)
        return res.status(401).json({ error: 'Unauthorized' });
    const result = await (0, mentorCollab_service_1.getTasksForMember)(memberId);
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.getMemberTasksController = getMemberTasksController;
const shareJournalEntryController = async (req, res) => {
    const memberId = getUser(req)?.userId;
    if (!memberId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { journalId, mentorId, allowed } = req.body || {};
    if (!journalId || !mentorId) {
        return res.status(400).json({ error: 'journalId and mentorId are required' });
    }
    const result = await (0, mentorCollab_service_1.shareJournalEntry)({ journalId, mentorId, memberId, allowed });
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.shareJournalEntryController = shareJournalEntryController;
const getSharedJournalEntriesController = async (req, res) => {
    const mentorId = getUser(req)?.userId;
    if (!mentorId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { memberId } = req.params;
    const result = await (0, mentorCollab_service_1.getSharedJournalEntries)(mentorId, memberId);
    return res.status(result.ok ? 200 : 400).json(result);
};
exports.getSharedJournalEntriesController = getSharedJournalEntriesController;

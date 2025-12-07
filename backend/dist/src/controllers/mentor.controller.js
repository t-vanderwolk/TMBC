"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMentorNoteForMemberController = exports.getMentorNotesForMemberController = exports.getMentorMemberOverviewController = exports.getMentorNotesController = exports.getMentorEventsController = exports.getMentorUpcomingEventsController = exports.getMentorJournalNeedsController = exports.getMentorTasksController = exports.getMentorMenteesController = exports.getMentorOverviewController = exports.getMentorDashboard = void 0;
const mentor_service_1 = require("../services/mentor.service");
const registry_service_1 = require("../services/registry.service");
const getMentorDashboard = async (_req, res) => {
    const mentors = await (0, mentor_service_1.getMentorSummaries)();
    res.json({ status: 'ok', mentors });
};
exports.getMentorDashboard = getMentorDashboard;
const getMentorOverviewController = async (req, res) => {
    const mentor = req.user;
    const data = await (0, mentor_service_1.getMentorOverview)(mentor?.id || 'mentor');
    res.json(data);
};
exports.getMentorOverviewController = getMentorOverviewController;
const getMentorMenteesController = async (req, res) => {
    const mentor = req.user;
    const mentees = await (0, mentor_service_1.getMentorMentees)(mentor?.id || 'mentor');
    res.json(mentees);
};
exports.getMentorMenteesController = getMentorMenteesController;
const getMentorTasksController = async (req, res) => {
    const mentor = req.user;
    const tasks = await (0, mentor_service_1.getMentorTasks)(mentor?.id || 'mentor');
    res.json(tasks);
};
exports.getMentorTasksController = getMentorTasksController;
const getMentorJournalNeedsController = async (req, res) => {
    const mentor = req.user;
    const journals = await (0, mentor_service_1.getMentorJournalNeeds)(mentor?.id || 'mentor');
    res.json(journals);
};
exports.getMentorJournalNeedsController = getMentorJournalNeedsController;
const getMentorUpcomingEventsController = async (req, res) => {
    const mentor = req.user;
    const events = await (0, mentor_service_1.getMentorUpcomingEvents)(mentor?.id || 'mentor');
    res.json(events);
};
exports.getMentorUpcomingEventsController = getMentorUpcomingEventsController;
const getMentorEventsController = async (req, res) => {
    const mentor = req.user;
    const events = await (0, mentor_service_1.getMentorUpcomingEvents)(mentor?.id || 'mentor');
    res.json(events);
};
exports.getMentorEventsController = getMentorEventsController;
const getMentorNotesController = async (req, res) => {
    const mentor = req.user;
    const notes = await (0, mentor_service_1.getMentorNotes)(mentor?.id || 'mentor');
    res.json(notes);
};
exports.getMentorNotesController = getMentorNotesController;
const getMentorMemberOverviewController = async (req, res) => {
    const mentor = req.user;
    const memberId = req.params.id;
    if (!memberId) {
        return res.status(400).json({ error: 'memberId is required' });
    }
    const overview = await (0, mentor_service_1.getMentorMemberOverview)(mentor?.id || 'mentor', memberId);
    res.json(overview);
};
exports.getMentorMemberOverviewController = getMentorMemberOverviewController;
const getMentorNotesForMemberController = async (req, res) => {
    const { memberId } = req.params;
    if (!memberId) {
        return res.status(400).json({ error: 'memberId is required' });
    }
    const notes = await (0, registry_service_1.listMentorNotes)(memberId);
    res.json(notes);
};
exports.getMentorNotesForMemberController = getMentorNotesForMemberController;
const postMentorNoteForMemberController = async (req, res) => {
    const mentorId = req.user?.id;
    const { memberId, productId, note } = req.body || {};
    if (!mentorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!memberId || !note) {
        return res.status(400).json({ error: 'memberId and note are required' });
    }
    try {
        const created = await (0, registry_service_1.createMentorNote)({
            mentorId,
            memberId,
            productId,
            note,
        });
        res.status(201).json(created);
    }
    catch (error) {
        res.status(400).json({ error: error?.message || 'Unable to save note' });
    }
};
exports.postMentorNoteForMemberController = postMentorNoteForMemberController;

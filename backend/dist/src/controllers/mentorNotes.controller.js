"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMentorNoteController = exports.getMentorNotesController = void 0;
const mentorNotes_service_1 = require("../services/mentorNotes.service");
const getUser = (req) => req.user || {};
const getMentorNotesController = async (req, res) => {
    const user = getUser(req);
    const { memberId, moduleId } = req.params;
    if (!memberId || !moduleId) {
        return res.status(400).json({ error: 'memberId and moduleId are required' });
    }
    const normalizedRole = String(user.role ?? '').toLowerCase();
    const isMentor = normalizedRole === 'mentor' || normalizedRole === 'admin';
    const isMember = Boolean(user.userId && user.userId === memberId);
    if (!isMentor && !isMember) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const notes = await (0, mentorNotes_service_1.getMentorNotesForModule)({ memberId, moduleId });
    return res.json(notes);
};
exports.getMentorNotesController = getMentorNotesController;
const postMentorNoteController = async (req, res) => {
    const user = getUser(req);
    const { memberId, moduleId } = req.params;
    const { content } = req.body || {};
    if (!memberId || !moduleId) {
        return res.status(400).json({ error: 'memberId and moduleId are required' });
    }
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'content is required' });
    }
    const normalizedRole = String(user.role ?? '').toLowerCase();
    if (normalizedRole !== 'mentor' && normalizedRole !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const mentorId = user.userId;
    if (!mentorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const note = await (0, mentorNotes_service_1.addMentorNote)({ memberId, moduleId, mentorId, content });
    return res.status(201).json(note);
};
exports.postMentorNoteController = postMentorNoteController;

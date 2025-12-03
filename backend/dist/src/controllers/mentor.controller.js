"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorMenteesController = exports.getMentorOverviewController = exports.getMentorDashboard = void 0;
const mentor_service_1 = require("../services/mentor.service");
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

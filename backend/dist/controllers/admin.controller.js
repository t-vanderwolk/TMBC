"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectAdminWaitlistController = exports.approveAdminWaitlistController = exports.getAdminWaitlistController = exports.getAdminAnalyticsController = void 0;
const admin_service_1 = require("../services/admin.service");
const getAdminAnalyticsController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminAnalytics)();
    res.json(data);
};
exports.getAdminAnalyticsController = getAdminAnalyticsController;
const getAdminWaitlistController = async (_req, res) => {
    const entries = await (0, admin_service_1.getAdminWaitlistEntries)();
    res.json(entries);
};
exports.getAdminWaitlistController = getAdminWaitlistController;
const approveAdminWaitlistController = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }
    const entry = await (0, admin_service_1.approveWaitlistEntry)(id);
    res.json(entry);
};
exports.approveAdminWaitlistController = approveAdminWaitlistController;
const rejectAdminWaitlistController = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }
    const entry = await (0, admin_service_1.rejectWaitlistEntry)(id);
    res.json(entry);
};
exports.rejectAdminWaitlistController = rejectAdminWaitlistController;

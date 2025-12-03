"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectAdminWaitlistController = exports.approveAdminWaitlistController = exports.getAdminWaitlistController = exports.updateAdminSettingsController = exports.getAdminSettingsController = exports.updateAdminModuleController = exports.getAdminModulesController = exports.getAdminRegistryController = exports.deleteAdminEventController = exports.updateAdminEventController = exports.createAdminEventController = exports.getAdminEventsController = exports.updateAdminMentorController = exports.getAdminMentorsController = exports.deleteAdminUserController = exports.updateAdminUserController = exports.getAdminUsersController = exports.getAdminStatsController = void 0;
const admin_service_1 = require("../services/admin.service");
const respond = (res, data, status = 200) => res.status(status).json({ data });
const getAdminStatsController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminStats)();
    return respond(res, data);
};
exports.getAdminStatsController = getAdminStatsController;
const getAdminUsersController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminUsers)();
    return respond(res, data);
};
exports.getAdminUsersController = getAdminUsersController;
const updateAdminUserController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'user id is required' });
    }
    const payload = req.body;
    const updated = await (0, admin_service_1.updateAdminUser)(id, payload);
    return respond(res, updated);
};
exports.updateAdminUserController = updateAdminUserController;
const deleteAdminUserController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'user id is required' });
    }
    await (0, admin_service_1.deleteAdminUser)(id);
    return res.status(204).json({});
};
exports.deleteAdminUserController = deleteAdminUserController;
const getAdminMentorsController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminMentors)();
    return respond(res, data);
};
exports.getAdminMentorsController = getAdminMentorsController;
const updateAdminMentorController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'mentor id is required' });
    }
    const payload = req.body;
    const updated = await (0, admin_service_1.updateAdminMentor)(id, payload);
    return respond(res, updated);
};
exports.updateAdminMentorController = updateAdminMentorController;
const getAdminEventsController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminEvents)();
    return respond(res, data);
};
exports.getAdminEventsController = getAdminEventsController;
const createAdminEventController = async (req, res) => {
    const user = req.user;
    const payload = req.body;
    if (!payload?.name || !payload?.date) {
        return res.status(400).json({ error: 'name and date are required' });
    }
    const event = await (0, admin_service_1.createAdminEvent)(payload, user?.id, user?.name ?? user?.email);
    return respond(res, event, 201);
};
exports.createAdminEventController = createAdminEventController;
const updateAdminEventController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'event id is required' });
    }
    const payload = req.body;
    const event = await (0, admin_service_1.updateAdminEvent)(id, payload);
    return respond(res, event);
};
exports.updateAdminEventController = updateAdminEventController;
const deleteAdminEventController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'event id is required' });
    }
    await (0, admin_service_1.deleteAdminEvent)(id);
    return res.status(204).json({});
};
exports.deleteAdminEventController = deleteAdminEventController;
const getAdminRegistryController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminRegistryMonitor)();
    return respond(res, data);
};
exports.getAdminRegistryController = getAdminRegistryController;
const getAdminModulesController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminModules)();
    return respond(res, data);
};
exports.getAdminModulesController = getAdminModulesController;
const updateAdminModuleController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'module id is required' });
    }
    const data = await (0, admin_service_1.updateAdminModule)(id, req.body);
    return respond(res, data);
};
exports.updateAdminModuleController = updateAdminModuleController;
const getAdminSettingsController = async (_req, res) => {
    const data = await (0, admin_service_1.getAdminSettings)();
    return respond(res, data);
};
exports.getAdminSettingsController = getAdminSettingsController;
const updateAdminSettingsController = async (req, res) => {
    const data = await (0, admin_service_1.updateAdminSettings)(req.body);
    return respond(res, data);
};
exports.updateAdminSettingsController = updateAdminSettingsController;
const getAdminWaitlistController = async (_req, res) => {
    const entries = await (0, admin_service_1.getAdminWaitlistEntries)();
    return respond(res, entries);
};
exports.getAdminWaitlistController = getAdminWaitlistController;
const approveAdminWaitlistController = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }
    const entry = await (0, admin_service_1.approveWaitlistEntry)(id);
    return respond(res, entry);
};
exports.approveAdminWaitlistController = approveAdminWaitlistController;
const rejectAdminWaitlistController = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }
    const entry = await (0, admin_service_1.rejectWaitlistEntry)(id);
    return respond(res, entry);
};
exports.rejectAdminWaitlistController = rejectAdminWaitlistController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reject = exports.approve = exports.listPending = exports.join = void 0;
const waitlist_service_1 = require("../services/waitlist.service");
const join = async (req, res) => {
    const { email, name } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    const entry = await (0, waitlist_service_1.joinWaitlist)({ email, name });
    return res.json(entry);
};
exports.join = join;
const listPending = async (_req, res) => {
    const entries = await (0, waitlist_service_1.getPendingWaitlist)();
    return res.json(entries);
};
exports.listPending = listPending;
const approve = async (req, res) => {
    const { id } = req.params;
    const entry = await (0, waitlist_service_1.updateWaitlistStatus)(id, 'approved');
    return res.json(entry);
};
exports.approve = approve;
const reject = async (req, res) => {
    const { id } = req.params;
    const entry = await (0, waitlist_service_1.updateWaitlistStatus)(id, 'rejected');
    return res.json(entry);
};
exports.reject = reject;

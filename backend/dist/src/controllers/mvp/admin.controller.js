"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getStats = void 0;
const devUsers_1 = require("../../utils/devUsers");
const getStats = (_req, res) => {
    const users = (0, devUsers_1.getDevUsers)();
    const members = users.filter((user) => user.role === 'MEMBER').length;
    const mentors = users.filter((user) => user.role === 'MENTOR').length;
    return res.json({
        members,
        mentors,
        pendingInvites: 3,
    });
};
exports.getStats = getStats;
const getUsers = (_req, res) => {
    const users = (0, devUsers_1.getDevUsers)();
    return res.json(users.map(devUsers_1.sanitizeUser));
};
exports.getUsers = getUsers;

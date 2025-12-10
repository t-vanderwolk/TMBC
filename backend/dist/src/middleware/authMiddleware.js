"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAdminAuth = exports.requireAuth = void 0;
const devUsers_1 = require("../utils/devUsers");
const extractToken = (req) => {
    const header = req.headers.authorization;
    if (!header)
        return null;
    if (!header.startsWith('Bearer '))
        return null;
    return header.replace('Bearer ', '');
};
const normalizeRole = (value) => value?.toUpperCase() ?? 'MEMBER';
const requireAuth = (req, res, next) => {
    const token = extractToken(req);
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    const payload = (0, devUsers_1.parseSessionToken)(token);
    if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    const role = normalizeRole(payload.role);
    req.user = {
        ...payload,
        role,
        userId: payload.id,
    };
    next();
};
exports.requireAuth = requireAuth;
const requireAdminAuth = (req, res, next) => {
    (0, exports.requireAuth)(req, res, () => {
        const user = req.user;
        if (user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    });
};
exports.requireAdminAuth = requireAdminAuth;
const requireRole = (role) => {
    return (req, res, next) => {
        (0, exports.requireAuth)(req, res, () => {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const normalized = role.toLowerCase();
            const userRole = String(user.role ?? '').toLowerCase();
            if (normalized === 'admin' && userRole === 'admin') {
                return next();
            }
            if (normalized === 'mentor' && (userRole === 'mentor' || userRole === 'admin')) {
                return next();
            }
            if (normalized === 'member' && userRole === 'member') {
                return next();
            }
            return res.status(403).json({ error: 'Forbidden' });
        });
    };
};
exports.requireRole = requireRole;

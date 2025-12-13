"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminAuth = exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const extractToken = (req) => {
    const header = req.headers.authorization;
    if (!header)
        return null;
    if (!header.startsWith('Bearer '))
        return null;
    return header.replace('Bearer ', '');
};
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
const requireAuth = (req, res, next) => {
    const token = extractToken(req);
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.requireAuth = requireAuth;
const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
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
    };
};
exports.requireRole = requireRole;
const requireAdminAuth = (req, res, next) => {
    const token = extractToken(req);
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = verifyToken(token);
        const userRole = String(payload.role ?? '').toLowerCase();
        if (userRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.requireAdminAuth = requireAdminAuth;

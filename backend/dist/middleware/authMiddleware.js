"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
        const userRole = user.role?.toLowerCase();
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

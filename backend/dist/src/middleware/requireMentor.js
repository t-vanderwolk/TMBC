"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireMentor = void 0;
const authMiddleware_1 = require("./authMiddleware");
const requireMentor = (req, res, next) => {
    (0, authMiddleware_1.requireAuth)(req, res, () => {
        const user = req.user;
        const role = String(user?.role ?? '').toLowerCase();
        if (role === 'mentor' || role === 'admin') {
            return next();
        }
        res.status(403).json({ error: 'Forbidden' });
    });
};
exports.requireMentor = requireMentor;

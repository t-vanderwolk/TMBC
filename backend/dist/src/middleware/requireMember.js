"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireMember = void 0;
const authMiddleware_1 = require("./authMiddleware");
const requireMember = (req, res, next) => {
    (0, authMiddleware_1.requireAuth)(req, res, () => {
        const user = req.user;
        if (String(user?.role ?? '').toUpperCase() === 'MEMBER') {
            return next();
        }
        res.status(403).json({ error: 'Forbidden' });
    });
};
exports.requireMember = requireMember;

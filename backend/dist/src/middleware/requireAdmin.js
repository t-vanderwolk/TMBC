"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const authMiddleware_1 = require("./authMiddleware");
const requireAdmin = (req, res, next) => {
    (0, authMiddleware_1.requireAuth)(req, res, () => {
        const user = req.user;
        if (String(user?.role ?? '').toUpperCase() === 'ADMIN') {
            return next();
        }
        res.status(403).json({ error: 'Forbidden' });
    });
};
exports.requireAdmin = requireAdmin;

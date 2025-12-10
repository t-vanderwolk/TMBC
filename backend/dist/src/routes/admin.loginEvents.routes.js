"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../../prisma/client");
const requireAdmin_1 = require("../middleware/requireAdmin");
const router = (0, express_1.Router)();
router.use(requireAdmin_1.requireAdmin);
router.get('/', async (_req, res, next) => {
    try {
        const loginEvents = await client_1.prisma.loginEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
        res.json(loginEvents);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../utils/prisma");
const router = (0, express_1.Router)();
router.get('/health/db', async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        return res.json({ status: 'ok', message: 'Database connected' });
    }
    catch (err) {
        return res
            .status(500)
            .json({ status: 'error', message: 'DB connection failed', error: String(err) });
    }
});
exports.default = router;

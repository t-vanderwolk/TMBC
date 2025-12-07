"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registry_controller_1 = require("../../controllers/mvp/registry.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/summary', authMiddleware_1.requireAuth, registry_controller_1.getSummary);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academy_controller_1 = require("../../controllers/mvp/academy.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/modules', authMiddleware_1.requireAuth, academy_controller_1.getModules);
router.get('/modules/:slug', authMiddleware_1.requireAuth, academy_controller_1.getModuleDetail);
exports.default = router;

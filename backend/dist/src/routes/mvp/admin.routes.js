"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../../controllers/mvp/admin.controller");
const requireAdmin_1 = require("../../middleware/requireAdmin");
const router = (0, express_1.Router)();
router.get('/stats', requireAdmin_1.requireAdmin, admin_controller_1.getStats);
router.get('/users', requireAdmin_1.requireAdmin, admin_controller_1.getUsers);
exports.default = router;

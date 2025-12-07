"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../../controllers/mvp/health.controller");
const router = (0, express_1.Router)();
router.get('/ping', health_controller_1.ping);
exports.default = router;

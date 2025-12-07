"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminOverview_controller_1 = require("../controllers/adminOverview.controller");
const router = (0, express_1.Router)();
router.get('/', adminOverview_controller_1.getAdminOverviewController);
exports.default = router;

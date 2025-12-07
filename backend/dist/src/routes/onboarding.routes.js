"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const onboarding_controller_1 = require("../controllers/onboarding.controller");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.requireAuth, onboarding_controller_1.saveOnboardingProfileController);
router.get('/me', authMiddleware_1.requireAuth, onboarding_controller_1.getOnboardingProfileController);
exports.default = router;

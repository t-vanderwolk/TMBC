"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onboarding_controller_1 = require("../../controllers/mvp/onboarding.controller");
const router = (0, express_1.Router)();
router.post('/request-invite', onboarding_controller_1.requestInvite);
router.post('/verify-code', onboarding_controller_1.verifyCode);
router.post('/create-profile', onboarding_controller_1.createProfile);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mentor_controller_1 = require("../../controllers/mvp/mentor.controller");
const requireMentor_1 = require("../../middleware/requireMentor");
const router = (0, express_1.Router)();
router.get('/mentees', requireMentor_1.requireMentor, mentor_controller_1.getMentees);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_controller_1 = require("../controllers/events.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.requireAuth, events_controller_1.getEventsController);
router.post('/rsvp', authMiddleware_1.requireAuth, events_controller_1.rsvpEventController);
exports.default = router;

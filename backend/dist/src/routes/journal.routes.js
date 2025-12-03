"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const journal_controller_1 = require("../controllers/journal.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.requireAuth, journal_controller_1.getJournalEntriesController);
router.post('/', authMiddleware_1.requireAuth, journal_controller_1.postJournalEntryController);
exports.default = router;

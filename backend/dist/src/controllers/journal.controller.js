"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postJournalEntryController = exports.getJournalEntriesController = void 0;
const journal_service_1 = require("../services/journal.service");
const getJournalEntriesController = async (req, res) => {
    const user = req.user;
    const data = await (0, journal_service_1.listJournalEntries)(user?.id || 'guest');
    res.json(data);
};
exports.getJournalEntriesController = getJournalEntriesController;
const postJournalEntryController = async (req, res) => {
    const user = req.user;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const entry = await (0, journal_service_1.createJournalEntry)(user?.id || 'guest', content);
    res.status(201).json(entry);
};
exports.postJournalEntryController = postJournalEntryController;

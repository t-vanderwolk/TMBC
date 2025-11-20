"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkbookEntryController = exports.updateWorkbookEntryController = exports.listWorkbookEntriesController = exports.createWorkbookEntryController = void 0;
const workbook_service_1 = require("../services/workbook.service");
const supportedTypes = ['journal', 'moodboard', 'checklist', 'reflection'];
const getUserId = (req) => req.user?.userId;
const createWorkbookEntryController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { moduleId, type, content } = req.body;
    if (!moduleId || !type || !content) {
        return res.status(400).json({ error: 'moduleId, type, and content are required' });
    }
    if (!supportedTypes.includes(type)) {
        return res.status(400).json({ error: 'Unsupported workbook type' });
    }
    try {
        const entry = await (0, workbook_service_1.createWorkbookEntry)({ userId, moduleId, type, content });
        return res.status(201).json(entry);
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || 'Unable to create entry' });
    }
};
exports.createWorkbookEntryController = createWorkbookEntryController;
const listWorkbookEntriesController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const moduleId = typeof req.query.moduleId === 'string' ? req.query.moduleId : undefined;
    if (!moduleId) {
        return res.status(400).json({ error: 'moduleId is required' });
    }
    try {
        const entries = await (0, workbook_service_1.listWorkbookEntries)({ userId, moduleId });
        return res.json({ entries });
    }
    catch (error) {
        return res.status(500).json({ error: error?.message || 'Unable to list entries' });
    }
};
exports.listWorkbookEntriesController = listWorkbookEntriesController;
const updateWorkbookEntryController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const content = req.body?.content;
    if (!id || !content) {
        return res.status(400).json({ error: 'Entry id and content are required' });
    }
    try {
        const entry = await (0, workbook_service_1.updateWorkbookEntry)({ id, userId, content });
        return res.json(entry);
    }
    catch (error) {
        return res.status(404).json({ error: error?.message || 'Workbook entry not found' });
    }
};
exports.updateWorkbookEntryController = updateWorkbookEntryController;
const deleteWorkbookEntryController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Entry id is required' });
    }
    try {
        await (0, workbook_service_1.deleteWorkbookEntry)({ id, userId });
        return res.status(204).end();
    }
    catch (error) {
        return res.status(404).json({ error: error?.message || 'Workbook entry not found' });
    }
};
exports.deleteWorkbookEntryController = deleteWorkbookEntryController;

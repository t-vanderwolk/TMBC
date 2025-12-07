"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const workbook_controller_1 = require("../controllers/workbook.controller");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.post('/create', workbook_controller_1.createWorkbookEntryController);
router.get('/list', workbook_controller_1.listWorkbookEntriesController);
router.patch('/update/:id', workbook_controller_1.updateWorkbookEntryController);
router.delete('/delete/:id', workbook_controller_1.deleteWorkbookEntryController);
router.get('/templates', (_req, res) => {
    res.json({
        templates: [
            {
                id: 'cozy-nursery',
                notes: 'Soft textures, warm lighting...',
                checklist: ['Soft light', 'Fabric swatch'],
            },
            {
                id: 'modern-minimal',
                notes: 'Clean lines, muted palette.',
                checklist: ['Hidden storage', 'Declutter décor'],
            },
        ],
    });
});
exports.default = router;

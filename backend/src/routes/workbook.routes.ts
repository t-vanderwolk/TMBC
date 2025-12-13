import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware';
import {
  createWorkbookEntryController,
  deleteWorkbookEntryController,
  listWorkbookEntriesController,
  updateWorkbookEntryController,
} from '../controllers/workbook.controller';

const router = Router();

router.use(requireAuth);
router.post('/create', createWorkbookEntryController);
router.get('/list', listWorkbookEntriesController);
router.patch('/update/:id', updateWorkbookEntryController);
router.delete('/delete/:id', deleteWorkbookEntryController);

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

export default router;

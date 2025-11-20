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

export default router;

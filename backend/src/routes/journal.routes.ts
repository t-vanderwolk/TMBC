import { Router } from 'express';

import {
  getJournalEntriesController,
  postJournalEntryController,
} from '../controllers/journal.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getJournalEntriesController);
router.post('/', requireAuth, postJournalEntryController);

export default router;

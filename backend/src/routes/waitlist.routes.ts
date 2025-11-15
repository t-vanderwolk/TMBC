import { Router } from 'express';

import {
  approve,
  join,
  listPending,
  reject,
} from '../controllers/waitlist.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/join', join);
router.get('/pending', requireAuth, requireRole('admin'), listPending);
router.post('/approve/:id', requireAuth, requireRole('admin'), approve);
router.post('/reject/:id', requireAuth, requireRole('admin'), reject);

export default router;

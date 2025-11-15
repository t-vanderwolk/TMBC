import { Router } from 'express';

import {
  consume,
  generate,
  validate,
} from '../controllers/invite.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/generate',
  requireAuth,
  requireRole('mentor'),
  generate,
);
router.post('/validate', validate);
router.post('/consume', consume);

export default router;

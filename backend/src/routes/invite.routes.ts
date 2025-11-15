import { Router } from 'express';

import {
  consume,
  generate,
  listInvites,
  sendInvite,
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
router.get('/list', requireAuth, requireRole('admin'), listInvites);
router.post('/send', requireAuth, requireRole('admin'), sendInvite);
router.post('/validate', validate);
router.post('/consume', consume);

export default router;

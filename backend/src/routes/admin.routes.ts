import { Router } from 'express';

import {
  approveAdminWaitlistController,
  getAdminAnalyticsController,
  getAdminWaitlistController,
  rejectAdminWaitlistController,
} from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/analytics', requireAuth, requireRole('admin'), getAdminAnalyticsController);
router.get('/waitlist', requireAuth, requireRole('admin'), getAdminWaitlistController);
router.post('/waitlist/approve', requireAuth, requireRole('admin'), approveAdminWaitlistController);
router.post('/waitlist/reject', requireAuth, requireRole('admin'), rejectAdminWaitlistController);

export default router;

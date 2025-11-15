import { Router } from 'express';

import { getAdminDashboardController } from '../controllers/admin.controller';

import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), getAdminDashboardController);

export default router;

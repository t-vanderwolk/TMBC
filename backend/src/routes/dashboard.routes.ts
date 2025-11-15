import { Router } from 'express';

import { getDashboardOverviewController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/overview', requireAuth, getDashboardOverviewController);

export default router;

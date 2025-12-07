import { Router } from 'express';

import {
  getDashboardController,
  getDashboardOverviewController,
} from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getDashboardController);
router.get('/overview', requireAuth, getDashboardOverviewController);

export default router;

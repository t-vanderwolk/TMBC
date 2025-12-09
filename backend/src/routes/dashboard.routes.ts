import { Router } from 'express';

import {
  getDashboardController,
  getDashboardOverviewController,
} from '../controllers/dashboard.controller';
import { requireMember } from '../middleware/requireMember';

const router = Router();

router.use(requireMember);

router.get('/', getDashboardController);
router.get('/overview', getDashboardOverviewController);

export default router;

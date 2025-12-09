import { Router } from 'express';

import { getAdminOverviewController } from '../controllers/adminOverview.controller';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();
router.use(requireAdmin);

router.get('/', getAdminOverviewController);

export default router;

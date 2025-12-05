import { Router } from 'express';

import { getAdminOverviewController } from '../controllers/adminOverview.controller';

const router = Router();

router.get('/', getAdminOverviewController);

export default router;

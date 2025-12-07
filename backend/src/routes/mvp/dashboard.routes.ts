import { Router } from 'express';

import { getOverview } from '../../controllers/mvp/dashboard.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.get('/overview', requireAuth, getOverview);

export default router;

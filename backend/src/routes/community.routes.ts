import { Router } from 'express';

import { getCommunityDashboard } from '../controllers/community.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getCommunityDashboard);

export default router;

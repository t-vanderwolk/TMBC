import { Router } from 'express';

import { getCommunityFeedController } from '../controllers/community.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/feed', requireAuth, getCommunityFeedController);

export default router;

import { Router } from 'express';

import { getRegistryDashboard } from '../controllers/registry.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getRegistryDashboard);

export default router;

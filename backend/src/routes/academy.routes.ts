import { Router } from 'express';

import { getAcademyDashboard } from '../controllers/academy.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getAcademyDashboard);

export default router;

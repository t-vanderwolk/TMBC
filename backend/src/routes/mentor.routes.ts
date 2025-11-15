import { Router } from 'express';

import { getMentorDashboard } from '../controllers/mentor.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, requireRole('mentor'), getMentorDashboard);

export default router;

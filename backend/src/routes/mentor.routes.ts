import { Router } from 'express';

import {
  getMentorDashboard,
  getMentorMenteesController,
  getMentorOverviewController,
} from '../controllers/mentor.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, requireRole('mentor'), getMentorDashboard);
router.get('/overview', requireAuth, requireRole('mentor'), getMentorOverviewController);
router.get('/mentees', requireAuth, requireRole('mentor'), getMentorMenteesController);

export default router;

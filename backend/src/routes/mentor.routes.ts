import { Router } from 'express';

import {
  getMentorDashboard,
  getMentorJournalNeedsController,
  getMentorMenteesController,
  getMentorOverviewController,
  getMentorTasksController,
  getMentorUpcomingEventsController,
} from '../controllers/mentor.controller';
import { requireMentor } from '../middleware/requireMentor';

const router = Router();

router.get('/', requireMentor, getMentorDashboard);
router.get('/overview', requireMentor, getMentorOverviewController);
router.get('/mentees', requireMentor, getMentorMenteesController);
router.get('/tasks', requireMentor, getMentorTasksController);
router.get('/journal-needs', requireMentor, getMentorJournalNeedsController);
router.get('/upcoming-events', requireMentor, getMentorUpcomingEventsController);

export default router;

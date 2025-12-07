import { Router } from 'express';

import {
  getMentorDashboard,
  getMentorEventsController,
  getMentorJournalNeedsController,
  getMentorMemberOverviewController,
  getMentorMenteesController,
  getMentorNotesController,
  getMentorNotesForMemberController,
  postMentorNoteForMemberController,
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
router.get('/events', requireMentor, getMentorEventsController);
router.get('/notes', requireMentor, getMentorNotesController);
router.get('/notes/member/:memberId', requireMentor, getMentorNotesForMemberController);
router.post('/notes/add', requireMentor, postMentorNoteForMemberController);
router.get('/member/:id/overview', requireMentor, getMentorMemberOverviewController);

export default router;

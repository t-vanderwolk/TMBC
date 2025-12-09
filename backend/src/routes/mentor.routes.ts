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
router.use(requireMentor);

router.get('/', getMentorDashboard);
router.get('/overview', getMentorOverviewController);
router.get('/mentees', getMentorMenteesController);
router.get('/tasks', getMentorTasksController);
router.get('/journal-needs', getMentorJournalNeedsController);
router.get('/upcoming-events', getMentorUpcomingEventsController);
router.get('/events', getMentorEventsController);
router.get('/notes', getMentorNotesController);
router.get('/notes/member/:memberId', getMentorNotesForMemberController);
router.post('/notes/add', postMentorNoteForMemberController);
router.get('/member/:id/overview', getMentorMemberOverviewController);

export default router;

import { Router } from 'express';

import {
  completeMentorTaskController,
  getMemberFeedbackController,
  getMemberProfileController,
  getMemberTasksController,
  getMenteeListController,
  getMentorOverviewController,
  getMentorTasksController,
  getSharedJournalEntriesController,
  postMentorFeedbackController,
  postMentorTaskController,
  shareJournalEntryController,
} from '../controllers/mentorCollab.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/overview', requireAuth, requireRole('mentor'), getMentorOverviewController);
router.get('/mentees', requireAuth, requireRole('mentor'), getMenteeListController);
router.get('/member/:id', requireAuth, requireRole('mentor'), getMemberProfileController);

router.post('/feedback', requireAuth, postMentorFeedbackController);
router.get('/feedback/:memberId', requireAuth, getMemberFeedbackController);

router.post('/tasks', requireAuth, requireRole('mentor'), postMentorTaskController);
router.post('/tasks/:taskId/complete', requireAuth, requireRole('mentor'), completeMentorTaskController);
router.get('/tasks', requireAuth, requireRole('mentor'), getMentorTasksController);
router.get('/member/tasks', requireAuth, requireRole('member'), getMemberTasksController);

router.post('/journal/share', requireAuth, requireRole('member'), shareJournalEntryController);
router.get('/journal/shared/:memberId', requireAuth, requireRole('mentor'), getSharedJournalEntriesController);

export default router;

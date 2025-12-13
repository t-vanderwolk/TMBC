import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware';
import { requireMentor } from '../middleware/requireMentor';
import { getMentorNotesController, postMentorNoteController } from '../controllers/mentorNotes.controller';

const router = Router();

router.get('/:memberId/:moduleId', requireAuth, getMentorNotesController);
router.post('/:memberId/:moduleId', requireMentor, postMentorNoteController);

export default router;

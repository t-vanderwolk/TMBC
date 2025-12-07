import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware';
import { requireMentor } from '../middleware/requireMentor';
import {
  getConversationController,
  postMessageController,
  getCurrentConversationController,
  getMentorConversationsController,
} from '../controllers/chat.controller';

const router = Router();

router.get('/current', requireAuth, getCurrentConversationController);
router.get('/conversations', requireMentor, getMentorConversationsController);
router.get('/:mentorId/:memberId', requireAuth, getConversationController);
router.post('/message', requireAuth, postMessageController);

export default router;

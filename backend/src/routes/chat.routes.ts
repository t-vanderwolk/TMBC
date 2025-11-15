import { Router } from 'express';

import {
  getMessagesController,
  getThreadsController,
  postMessageController,
} from '../controllers/chat.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/threads', requireAuth, getThreadsController);
router.get('/messages/:threadId', requireAuth, getMessagesController);
router.post('/messages', requireAuth, postMessageController);

export default router;

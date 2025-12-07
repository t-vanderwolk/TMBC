import { Router } from 'express';

import {
  getCommunityRoomsController,
  getRoomPostsController,
  postCommunityRoomPostController,
} from '../controllers/community.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/rooms', requireAuth, getCommunityRoomsController);
router.get('/rooms/:id/posts', requireAuth, getRoomPostsController);
router.post('/rooms/:id/post', requireAuth, postCommunityRoomPostController);

export default router;

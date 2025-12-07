import { Router } from 'express';

import { getRooms } from '../../controllers/mvp/community.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.get('/rooms', requireAuth, getRooms);

export default router;

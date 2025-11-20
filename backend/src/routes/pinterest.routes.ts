import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware';
import {
  getPinterestAuthController,
  getPinterestCallbackController,
  savePinController,
} from '../controllers/pinterest.controller';

const router = Router();

router.get('/auth', requireAuth, getPinterestAuthController);
router.get('/callback', getPinterestCallbackController);
router.post('/save-pin', requireAuth, savePinController);

export default router;

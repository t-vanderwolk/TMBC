import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware';
import {
  fetchPinterestBoardPinsController,
  fetchPinterestBoardsController,
  getPinterestAuthController,
  getPinterestCallbackController,
  getPinterestStatusController,
  savePinController,
} from '../controllers/pinterest.controller';

const router = Router();

router.get('/auth', requireAuth, getPinterestAuthController);
router.get('/callback', getPinterestCallbackController);
router.get('/boards', requireAuth, fetchPinterestBoardsController);
router.get('/boards/:boardId/pins', requireAuth, fetchPinterestBoardPinsController);
router.get('/status', requireAuth, getPinterestStatusController);
router.post('/save-pin', requireAuth, savePinController);

export default router;

import { Router } from 'express';

import {
  getJourneysController,
  getModulesController,
  getRecommendedModuleController,
  getTracksController,
} from '../controllers/academy.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/journeys', requireAuth, getJourneysController);
router.get('/tracks', requireAuth, getTracksController);
router.get('/modules', requireAuth, getModulesController);
router.get('/recommended', requireAuth, getRecommendedModuleController);

export default router;

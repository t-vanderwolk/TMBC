import { Router } from 'express';

import {
  getJourneysController,
  getModulesController,
  getModuleProductsController,
  getModuleRecommendationsController,
  getModuleRecommendedListController,
  getRecommendedModuleController,
  getTracksController,
  getProgressController,
} from '../controllers/academy.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/journeys', requireAuth, getJourneysController);
router.get('/tracks', requireAuth, getTracksController);
router.get('/modules', requireAuth, getModulesController);
router.get('/recommended', requireAuth, getRecommendedModuleController);
router.get('/progress', requireAuth, getProgressController);
router.get('/:moduleCode/products', requireAuth, getModuleProductsController);
router.get('/:moduleCode/recommendations', requireAuth, getModuleRecommendationsController);
router.get('/module/:moduleCode/recommended', requireAuth, getModuleRecommendedListController);

export default router;

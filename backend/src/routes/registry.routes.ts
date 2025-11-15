import { Router } from 'express';

import {
  deleteRegistryItem,
  getRegistryList,
  getRegistryRecommendations,
  postRegistryItem,
} from '../controllers/registry.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/list', requireAuth, getRegistryList);
router.get('/recommendations', requireAuth, getRegistryRecommendations);
router.post('/add', requireAuth, postRegistryItem);
router.delete('/remove/:id', requireAuth, deleteRegistryItem);

export default router;

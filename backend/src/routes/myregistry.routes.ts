import { Router } from 'express';

import {
  addMyRegistryGiftController,
  createMyRegistryUserController,
  listMyRegistryGiftsController,
  removeMyRegistryGiftController,
  updateMyRegistryGiftController,
} from '../controllers/myregistry.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-user', requireAuth, createMyRegistryUserController);
router.post('/add', requireAuth, addMyRegistryGiftController);
router.post('/update', requireAuth, updateMyRegistryGiftController);
router.post('/remove', requireAuth, removeMyRegistryGiftController);
router.get('/list', requireAuth, listMyRegistryGiftsController);

export default router;

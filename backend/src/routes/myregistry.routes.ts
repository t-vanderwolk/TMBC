import { Router } from 'express';

import {
  addMyRegistryGiftController,
  createMyRegistryUserController,
  getSyncStatusController,
  listMyRegistryGiftsController,
  removeMyRegistryGiftController,
  syncDownController,
  syncUpController,
  updateMyRegistryGiftController,
} from '../controllers/myregistry.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-user', requireAuth, createMyRegistryUserController);
router.post('/add', requireAuth, addMyRegistryGiftController);
router.post('/update', requireAuth, updateMyRegistryGiftController);
router.post('/remove', requireAuth, removeMyRegistryGiftController);
router.get('/list', requireAuth, listMyRegistryGiftsController);
router.post('/sync/down', requireAuth, syncDownController);
router.post('/sync/up', requireAuth, syncUpController);
router.get('/status', requireAuth, getSyncStatusController);

export default router;

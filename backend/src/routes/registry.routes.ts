import { Router } from 'express';

import {
  addCustomItemController,
  bulkAddRegistryItemsController,
  deleteRegistryItem,
  getMentorNotesController,
  getRegistryConflictsController,
  getRegistryList,
  postMentorNoteController,
  postRegistryItem,
  resolveRegistryConflictController,
  updateRegistryItemController,
} from '../controllers/registry.controller';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getRegistryList);
router.post('/add', requireAuth, postRegistryItem);
router.post('/bulk/add', requireAuth, bulkAddRegistryItemsController);
router.post('/custom/add', requireAuth, addCustomItemController);
router.post('/update', requireAuth, updateRegistryItemController);
router.post('/remove', requireAuth, deleteRegistryItem);
router.post('/:productId/notes', requireAuth, requireRole('mentor'), postMentorNoteController);
router.get('/:memberId/notes', requireAuth, requireRole('mentor'), getMentorNotesController);
router.get('/conflicts', requireAuth, getRegistryConflictsController);
router.post('/conflicts/resolve', requireAuth, resolveRegistryConflictController);

export default router;

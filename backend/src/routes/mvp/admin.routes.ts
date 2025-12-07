import { Router } from 'express';

import { getStats, getUsers } from '../../controllers/mvp/admin.controller';
import { requireAdmin } from '../../middleware/requireAdmin';

const router = Router();

router.get('/stats', requireAdmin, getStats);
router.get('/users', requireAdmin, getUsers);

export default router;

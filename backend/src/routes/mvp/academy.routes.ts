import { Router } from 'express';

import { getModuleDetail, getModules } from '../../controllers/mvp/academy.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.get('/modules', requireAuth, getModules);
router.get('/modules/:slug', requireAuth, getModuleDetail);

export default router;

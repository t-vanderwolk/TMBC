import { Router } from 'express';

import { getSummary } from '../../controllers/mvp/registry.controller';
import { requireAuth } from '../../middleware/authMiddleware';

const router = Router();

router.get('/summary', requireAuth, getSummary);

export default router;

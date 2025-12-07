import { Router } from 'express';

import { ping } from '../../controllers/mvp/health.controller';

const router = Router();

router.get('/ping', ping);

export default router;

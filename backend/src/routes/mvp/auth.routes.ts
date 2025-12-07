import { Router } from 'express';

import { loginStub } from '../../controllers/mvp/auth.controller';

const router = Router();

router.post('/login', loginStub);

export default router;

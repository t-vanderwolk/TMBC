import { Router } from 'express';

import {
  createProfile,
  requestInvite,
  verifyCode,
} from '../../controllers/mvp/onboarding.controller';

const router = Router();

router.post('/request-invite', requestInvite);
router.post('/verify-code', verifyCode);
router.post('/create-profile', createProfile);

export default router;

import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware';
import { getOnboardingProfileController, saveOnboardingProfileController } from '../controllers/onboarding.controller';

const router = Router();

router.post('/', requireAuth, saveOnboardingProfileController);
router.get('/me', requireAuth, getOnboardingProfileController);

export default router;

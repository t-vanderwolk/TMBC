import { Router } from 'express';

import {
  validateInviteCodeController,
  startOnboardingController,
  saveProfileController,
  assignMentorController,
  completeOnboardingController,
} from '../controllers/onboarding.controller';

const router = Router();

router.post('/validate', validateInviteCodeController);
router.post('/start', startOnboardingController);
router.post('/profile', saveProfileController);
router.post('/assign-mentor', assignMentorController);
router.post('/complete', completeOnboardingController);

export default router;

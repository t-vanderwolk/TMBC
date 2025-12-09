import { Router } from 'express';

import {
  getCurrentUser,
  login,
  register,
  completeOnboarding,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/complete-onboarding', completeOnboarding);
router.get('/me', requireAuth, getCurrentUser);

export default router;

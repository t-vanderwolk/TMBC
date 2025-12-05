import { Router } from 'express';

import {
  getEventsController,
  getUpcomingEventsController,
  rsvpEventController,
} from '../controllers/events.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/upcoming', requireAuth, getUpcomingEventsController);
router.get('/', requireAuth, getEventsController);
router.post('/rsvp', requireAuth, rsvpEventController);

export default router;

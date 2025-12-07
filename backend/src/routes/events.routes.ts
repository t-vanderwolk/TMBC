import { Router } from 'express';

import {
  getEventsController,
  getUpcomingEventsController,
  rsvpEventController,
} from '../controllers/events.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getEventsController);
router.get('/upcoming', requireAuth, getUpcomingEventsController);
router.post('/:id/rsvp', requireAuth, rsvpEventController);

export default router;

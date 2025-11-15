import { Router } from 'express';

import { getEventsController, rsvpEventController } from '../controllers/events.controller';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getEventsController);
router.post('/rsvp', requireAuth, rsvpEventController);

export default router;

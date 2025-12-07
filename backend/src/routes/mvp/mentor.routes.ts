import { Router } from 'express';

import { getMentees } from '../../controllers/mvp/mentor.controller';
import { requireMentor } from '../../middleware/requireMentor';

const router = Router();

router.get('/mentees', requireMentor, getMentees);

export default router;

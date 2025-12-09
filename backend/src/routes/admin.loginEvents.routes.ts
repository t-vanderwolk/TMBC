import { Router } from 'express';

import { prisma } from '../../prisma/client';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const loginEvents = await prisma.loginEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    res.json(loginEvents);
  } catch (error) {
    next(error);
  }
});

export default router;

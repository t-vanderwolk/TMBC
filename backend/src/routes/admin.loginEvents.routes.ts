import { Router } from 'express';

import { prisma } from '../../prisma/client';

const router = Router();

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

import { Router } from 'express';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/health/db', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok', message: 'Database connected' });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'error', message: 'DB connection failed', error: String(err) });
  }
});

export default router;

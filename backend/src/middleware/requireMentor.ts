import { NextFunction, Request, Response } from 'express';

import { requireAuth } from './authMiddleware';

export const requireMentor = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    const role = String(user?.role ?? '').toUpperCase();
    if (role === 'MENTOR' || role === 'ADMIN') {
      return next();
    }

    res.status(403).json({ error: 'Forbidden' });
  });
};

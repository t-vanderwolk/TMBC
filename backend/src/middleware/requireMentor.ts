import { NextFunction, Request, Response } from 'express';

import { requireAuth } from './authMiddleware';

export const requireMentor = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    const role = String(user?.role ?? '').toLowerCase();
    if (role === 'mentor' || role === 'admin') {
      return next();
    }
    res.status(403).json({ error: 'Forbidden' });
  });
};

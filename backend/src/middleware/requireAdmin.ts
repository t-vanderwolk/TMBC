import { NextFunction, Request, Response } from 'express';

import { requireAuth } from './authMiddleware';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (String(user?.role ?? '').toUpperCase() === 'ADMIN') {
      return next();
    }

    res.status(403).json({ error: 'Forbidden' });
  });
};

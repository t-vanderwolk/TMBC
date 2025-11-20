import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export type RoleName = 'admin' | 'mentor' | 'member';

export const requireRole = (role: RoleName) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const normalized = role.toLowerCase();
    const userRole = user.role?.toLowerCase();

    if (normalized === 'admin' && userRole === 'admin') {
      return next();
    }

    if (normalized === 'mentor' && (userRole === 'mentor' || userRole === 'admin')) {
      return next();
    }

    if (normalized === 'member' && userRole === 'member') {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
  };
};

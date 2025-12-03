import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const extractToken = (req: Request) => {
  const header = req.headers.authorization;
  if (!header) return null;
  if (!header.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '');
};

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = verifyToken(token);
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
    const userRole = String(user.role ?? '').toLowerCase();

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

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = verifyToken(token) as any;
    const userRole = String(payload.role ?? '').toLowerCase();
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

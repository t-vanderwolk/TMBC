import { Request, Response, NextFunction } from 'express';
import { parseSessionToken } from '../utils/devUsers';

const extractToken = (req: Request) => {
  const header = req.headers.authorization;
  if (!header) return null;
  if (!header.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '');
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const payload = parseSessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  (req as any).user = payload;
  next();
};

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  });
};

export type RoleName = 'admin' | 'mentor' | 'member';

export const requireRole = (role: RoleName) => {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

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
    });
  };
};

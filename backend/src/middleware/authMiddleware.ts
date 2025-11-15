import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { prisma } from '../utils/prisma';
import { verifyToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
    email: string;
    name: string | null;
  };
}

interface TokenPayload extends JwtPayload {
  userId: string;
  role: Role;
}

const unauthorized = (res: Response) => {
  res.status(401).json({ message: 'Unauthorized' });
};

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return unauthorized(res);
    }

    req.user = user;
    next();
  } catch (error) {
    unauthorized(res);
  }
};

export const requireRole =
  (role: Role | Role[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const roles = Array.isArray(role) ? role : [role];

    if (!req.user) {
      return unauthorized(res);
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };

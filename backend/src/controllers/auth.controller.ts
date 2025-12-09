import { NextFunction, Request, Response } from 'express';

import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import { loginUser, registerUser } from '../services/auth.service';
import { logLoginAttempt } from '../services/loginEvent.service';
import { prisma } from '../../prisma/client';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password,
      name,
      inviteCode,
      firstName,
      lastName,
      city,
      state,
      country,
      registryType,
    } = req.body;

    const result = await registerUser({
      email,
      password,
      name,
      inviteCode,
      firstName,
      lastName,
      city,
      state,
      country,
      registryType,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getRequestIp = (req: Request) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  return req.ip;
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const ip = getRequestIp(req);
  const userAgent = req.headers['user-agent']?.toString();

  try {
    const result = await loginUser({ email, password });

    if (!result.ok) {
      await logLoginAttempt({
        email,
        success: false,
        ip,
        userAgent,
      }).catch(() => null);
      return res.json(result);
    }

    await logLoginAttempt({
      user: { id: result.user.id, role: result.user.role as Role },
      email,
      success: true,
      ip,
      userAgent,
    }).catch(() => null);

    res.json({
      token: result.token,
      user: result.user,
      redirect: result.redirect,
    });
  } catch (error) {
    await logLoginAttempt({
      email,
      success: false,
      ip,
      userAgent,
    }).catch(() => null);

    next(error);
  }
};

export const completeOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code, name, password } = req.body;

    if (!code || !name || !password) {
      return res.status(400).json({ error: 'Missing onboarding data' });
    }

    const invite = await prisma.inviteCode.findUnique({
      where: { code },
    });

    if (!invite) {
      return res.status(400).json({ error: 'Invalid invite code' });
    }

    if (invite.used) {
      return res.status(410).json({ error: 'Invite already used' });
    }

    if (!invite.email) {
      return res.status(400).json({ error: 'Invite is missing an associated email address' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists for this invite' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: invite.email,
        name,
        password: hashed,
        role: Role.MEMBER,
        inviteCodeUsed: true,
        profileCompleted: true,
        onboardingComplete: true,
      },
    });

    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: {
        used: true,
        usedAt: new Date(),
        redeemedById: user.id,
      },
    });

    const loginResult = await loginUser({ email: invite.email, password });

    if (!loginResult.ok) {
      throw new Error('Unable to log in after onboarding');
    }

    return res.json(loginResult);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  const payload = (req as any).user;
  const tokenHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const token = tokenHeader.replace('Bearer ', '') || null;

  res.json({
    token,
    ...payload,
  });
};

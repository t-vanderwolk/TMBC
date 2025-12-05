import { NextFunction, Request, Response } from 'express';

import { loginUser, registerUser } from '../services/auth.service';
import { logLoginAttempt } from '../services/loginEvent.service';

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
    await logLoginAttempt({
      user: result.user,
      email,
      success: true,
      ip,
      userAgent,
    }).catch(() => null);

    res.json(result);
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

export const getCurrentUser = (req: Request, res: Response) => {
  const payload = (req as any).user;
  const tokenHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const token = tokenHeader.replace('Bearer ', '') || null;

  res.json({
    token,
    ...payload,
  });
};

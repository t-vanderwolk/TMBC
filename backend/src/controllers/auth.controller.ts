import { NextFunction, Request, Response } from 'express';

import { loginUser, registerUser } from '../services/auth.service';

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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

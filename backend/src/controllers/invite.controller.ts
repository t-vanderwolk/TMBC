import { NextFunction, Request, Response } from 'express';

import {
  consumeInvite,
  generateInvites,
  validateInvite,
} from '../services/invite.service';
import { signToken } from '../utils/jwt';

type AuthedRequest = Request & { user?: { id: string } };

export const generate = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role, quantity, expiresAt } = req.body;

    const parsedQuantity =
      typeof quantity === 'number'
        ? quantity
        : quantity
        ? Number(quantity)
        : undefined;

    if (parsedQuantity !== undefined && Number.isNaN(parsedQuantity)) {
      throw new Error('Quantity must be a number');
    }

    const invites = await generateInvites({
      creatorId: req.user!.id,
      role,
      quantity: parsedQuantity,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    res.json({
      invites,
    });
  } catch (error) {
    next(error);
  }
};

export const validate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;

    const invite = await validateInvite(code);

    res.json({
      valid: true,
      invite,
    });
  } catch (error) {
    next(error);
  }
};

export const consume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, email, password, name } = req.body;

    const user = await consumeInvite({ code, email, password, name });
    const { password: _ignore, ...safeUser } = user;

    res.json({
      token: signToken({ userId: user.id, role: user.role.toLowerCase() }),
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

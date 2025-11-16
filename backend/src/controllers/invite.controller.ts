import { NextFunction, Request, Response } from 'express';

import {
  consumeInvite,
  generateInvite,
  getAllInvites,
  validateInvite,
} from '../services/invite.service';
import { signToken } from '../utils/jwt';
import { sendInviteEmail } from '../services/email.service';

type AuthedRequest = Request & { user?: { id: string; email?: string } };

export const generate = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role, email, expiresAt, maxUses, quantity = 1 } = req.body;

    const parsedQuantity = Number(quantity);

    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const invites = [];

    for (let i = 0; i < parsedQuantity; i += 1) {
      const invite = await generateInvite({
        creatorId: req.user!.id,
        role,
        email,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        maxUses,
      });
      invites.push(invite);
    }

    res.json({ invites });
  } catch (error) {
    next(error);
  }
};

export const sendInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, email } = req.body;

    if (!code || !email) {
      return res.status(400).json({ message: 'Code and email are required' });
    }

    const invite = await validateInvite(code);

    await sendInviteEmail({
      to: email,
      code: invite.code,
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const listInvites = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const invites = await getAllInvites();
    res.json({ status: 'ok', invites });
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

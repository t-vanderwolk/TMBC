import { NextFunction, Request, Response } from 'express';

import {
  consumeInvite,
  generateInvite,
  getAllInvites,
  validateInvite as validateInviteService,
} from '../services/invite.service';
import { prisma } from '../../prisma/client';
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

    const invite = await validateInviteService(code);

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

    const invite = await validateInviteService(code);

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

export const validateInvite = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const invite = await prisma.inviteCode.findUnique({ where: { code } });
    if (!invite) {
      return res.status(400).json({ error: 'Invalid invite code' });
    }

    if (invite.used) {
      return res.status(410).json({ error: 'Invite already used' });
    }

    return res.json({
      valid: true,
      inviteId: invite.id,
      email: invite.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const redeemInvite = async (req: Request, res: Response) => {
  try {
    const { inviteId, userId } = req.body;

    if (!inviteId || !userId) {
      return res.status(400).json({ error: 'Invite and user IDs are required' });
    }

    const invite = await prisma.inviteCode.update({
      where: { id: inviteId },
      data: {
        used: true,
        usedAt: new Date(),
        redeemedById: userId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        profileCompleted: true,
        inviteCodeUsed: true,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { generateInviteCode } from '../utils/inviteCode';
import { generateToken, verifyToken } from '../utils/jwt';
import { hashPassword } from '../utils/password';

export async function submitInviteRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, firstName, lastName, message } = req.body;

    const existing = await prisma.inviteRequest.findUnique({ where: { email } });
    if (existing) {
      return res.json({ ok: true, requestId: existing.id });
    }

    const created = await prisma.inviteRequest.create({
      data: { email, firstName, lastName, message },
    });

    res.json({ ok: true, requestId: created.id });
  } catch (err) {
    next(err);
  }
}

export async function adminApproveInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId, adminId } = req.body;

    const code = generateInviteCode();

    const updated = await prisma.inviteRequest.update({
      where: { id: requestId },
      data: { status: 'approved', inviteCode: code, approvedById: adminId },
    });

    res.json({ ok: true, inviteCode: updated.inviteCode });
  } catch (err) {
    next(err);
  }
}

export async function verifyInviteCode(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.body;

    const match = await prisma.inviteRequest.findFirst({
      where: { inviteCode: code, status: 'approved' },
    });

    if (!match) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    const token = generateToken({ inviteRequestId: match.id });

    res.json({ ok: true, token });
  } catch (err) {
    next(err);
  }
}

export async function createInvitedUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, email, password, firstName, lastName } = req.body;

    const payload = verifyToken(token);
    if (!payload?.inviteRequestId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: Role.MEMBER,
        profile: {
          create: {
            inviteRequestId: payload.inviteRequestId,
            firstName,
            lastName,
          },
        },
      },
    });

    res.json({ ok: true, userId: user.id });
  } catch (err) {
    next(err);
  }
}

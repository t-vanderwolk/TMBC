import { NextFunction, Request, Response } from 'express';
import { Prisma, Role } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { generateInviteCode } from '../utils/inviteCode';
import { generateToken, verifyToken } from '../utils/jwt';
import { hashPassword } from '../utils/password';
import { getOfficialSenderEmail } from '../utils/officialSender';
import { sendInviteEmail } from '../services/email.service';

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
    const isUniqueConstraintError = (error: unknown) =>
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

    const existing = await prisma.inviteRequest.findUnique({ where: { id: requestId } });
    if (!existing) {
      return res.status(404).json({ error: 'Invite request not found' });
    }

    if (existing.status === 'approved') {
      return res.status(409).json({ error: 'Invite request already approved' });
    }

    let updated: typeof existing | null = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = generateInviteCode();
      try {
        updated = await prisma.inviteRequest.update({
          where: { id: requestId },
          data: { status: 'approved', inviteCode: code, approvedById: adminId },
        });
        break;
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          continue;
        }
        throw error;
      }
    }

    if (!updated) {
      throw new Error('Unable to generate a unique invite code');
    }

    // Approval must include a successful invite email send; otherwise we roll back the approval.
    try {
      await sendInviteEmail({ to: updated.email, code: updated.inviteCode! });
    } catch (error) {
      await prisma.inviteRequest.update({
        where: { id: updated.id },
        data: { status: 'pending', inviteCode: null, approvedById: null },
      });
      throw error;
    }

    console.info(
      `[Admin Action] ${getOfficialSenderEmail()} approved invite request ${updated.id} (adminId=${adminId})`,
    );

    res.json({ ok: true, inviteCode: updated.inviteCode });
  } catch (err) {
    next(err);
  }
}

// Invite Code Guardrails:
// - Only APPROVED invites may proceed
// - Homepage + Login both route through /verify
// - Admin approval is the single source of truth
export async function verifyInviteCode(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.body;

    const match = await prisma.inviteRequest.findFirst({
      where: { inviteCode: code, status: 'approved' },
    });

    if (!match) {
      return res
        .status(400)
        .json({
          error: "This code hasn’t been approved yet — we’ll email you when it is.",
        });
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

export async function listInviteRequests(_req: Request, res: Response, next: NextFunction) {
  try {
    const requests = await prisma.inviteRequest.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
      },
    });

    const payload = requests.map((request) => ({
      id: request.id,
      email: request.email,
      dueDate: request.profile?.dueDate?.toISOString() ?? null,
      vibe: request.message ?? null,
      supportNeeds: request.message ?? null,
      createdAt: request.createdAt.toISOString(),
      status: request.status,
    }));

    res.json({ data: payload });
  } catch (err) {
    next(err);
  }
}

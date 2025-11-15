import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { prisma } from '../utils/prisma';

const ROLE_INVITE_LIMITS: Record<Role, number | null> = {
  [Role.MEMBER]: 0,
  [Role.MENTOR]: 3,
  [Role.ADMIN]: null,
};

const sanitizeRole = (role: string): Role => {
  const normalized = role.toUpperCase();

  if (!Object.values(Role).includes(normalized as Role)) {
    throw new Error('Invalid role supplied for invite');
  }

  return normalized as Role;
};

interface GenerateInviteInput {
  creatorId: string;
  role: string;
  quantity?: number;
  expiresAt?: Date;
}

interface ConsumeInviteInput {
  code: string;
  email: string;
  password: string;
  name?: string;
}

const createInviteCode = () => crypto.randomBytes(8).toString('hex');

export const generateInvites = async ({
  creatorId,
  role,
  quantity = 1,
  expiresAt,
}: GenerateInviteInput) => {
  const creator = await prisma.user.findUnique({ where: { id: creatorId } });

  if (!creator) {
    throw new Error('Creator not found');
  }

  if (![Role.ADMIN, Role.MENTOR].includes(creator.role)) {
    throw new Error('User is not allowed to generate invites');
  }

  const normalizedRole = sanitizeRole(role);
  const limit = ROLE_INVITE_LIMITS[creator.role];

  if (limit !== null) {
    const activeInvites = await prisma.invite.count({
      where: { createdById: creatorId, used: false },
    });

    if (activeInvites >= limit) {
      throw new Error('Invite limit reached for your role');
    }

    const available = Math.max(limit - activeInvites, 0);
    quantity = Math.min(quantity, available || 0) || 0;
  }

  if (quantity <= 0) {
    throw new Error('No invites available to generate');
  }

  const payload = Array.from({ length: quantity }).map(() => ({
    code: createInviteCode(),
    createdById: creatorId,
    role: normalizedRole,
    expiresAt,
  }));

  const invites = await prisma.$transaction(
    payload.map((data) => prisma.invite.create({ data })),
  );

  return invites;
};

export const validateInvite = async (code: string) => {
  const invite = await prisma.invite.findUnique({ where: { code } });

  if (!invite) {
    throw new Error('Invite code not found');
  }

  if (invite.used) {
    throw new Error('Invite already used');
  }

  if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
    throw new Error('Invite expired');
  }

  return invite;
};

export const consumeInvite = async ({
  code,
  email,
  password,
  name,
}: ConsumeInviteInput): Promise<User> => {
  const invite = await validateInvite(code);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: invite.role,
    },
  });

  await prisma.invite.update({
    where: { id: invite.id },
    data: {
      used: true,
      usedAt: new Date(),
      usedById: user.id,
    },
  });

  return user;
};

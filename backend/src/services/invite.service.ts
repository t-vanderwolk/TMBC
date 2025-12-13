import { Invite, Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { prisma } from '../../prisma/client';

const INVITE_LIMITS: Record<Role, number | null> = {
  [Role.MEMBER]: 0,
  [Role.MENTOR]: 3,
  [Role.ADMIN]: null,
};

const normalizeRole = (role?: string | null): Role => {
  if (!role) return Role.MEMBER;
  const normalized = role.toUpperCase();
  if (!Object.values(Role).includes(normalized as Role)) {
    return Role.MEMBER;
  }
  return normalized as Role;
};

const createInviteCode = () => crypto.randomBytes(8).toString('hex').toUpperCase();

interface GenerateInviteInput {
  creatorId: string;
  email?: string;
  role?: string;
  expiresAt?: Date;
  maxUses?: number;
}

interface ConsumeInviteInput {
  code: string;
  email: string;
  password: string;
  name?: string;
}

const enforceMentorLimit = async (creatorId: string, role: Role) => {
  if (role !== Role.MENTOR) return;

  const activeCount = await prisma.invite.count({
    where: { createdById: creatorId, used: false },
  });

  if (activeCount >= (INVITE_LIMITS[Role.MENTOR] ?? 0)) {
    throw new Error('Mentors can only have three active invites at a time.');
  }
};

export const generateInvite = async ({
  creatorId,
  email,
  role,
  expiresAt,
  maxUses = 1,
}: GenerateInviteInput): Promise<Invite> => {
  const creator = await prisma.user.findUnique({ where: { id: creatorId } });

  if (!creator) {
    throw new Error('Creator not found');
  }

  const allowedCreatorRoles: Role[] = [Role.ADMIN, Role.MENTOR];
  if (!allowedCreatorRoles.includes(creator.role)) {
    throw new Error('Not allowed to generate invites');
  }

  await enforceMentorLimit(creator.id, creator.role);

  return prisma.invite.create({
    data: {
      code: createInviteCode(),
      createdById: creator.id,
      createdByEmail: creator.email,
      role: normalizeRole(role),
      email,
      expiresAt,
      maxUses,
    },
  });
};

export const validateInvite = async (code: string) => {
  const invite = await prisma.invite.findUnique({ where: { code } });

  if (!invite) {
    throw new Error('Invite not found');
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
      role: invite.role ?? Role.MEMBER,
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

export const getAllInvites = () => {
  return prisma.invite.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

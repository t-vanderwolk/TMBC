import { Prisma, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { AuthService } from './auth.service';
import { prisma } from '@/lib/prisma';

type SaveProfilePayload = {
  userId: string;
  name?: string;
  dueDate?: string;
  location?: string;
};

const toDate = (value?: string) => (value ? new Date(value) : undefined);
const createTempPassword = () => crypto.randomBytes(16).toString('hex');

export const validateInviteCode = async (code: string) => {
  const invite = await prisma.inviteCode.findUnique({
    where: { code },
  });
  if (!invite) {
    throw new Error('Invalid invite code');
  }
  if (invite.used) {
    throw new Error('Invite code already used');
  }
  return invite;
};

export const startOnboarding = async (inviteCode: string) => {
  const invite = await validateInviteCode(inviteCode);
  if (!invite.email) {
    throw new Error('Invite does not include an email address');
  }

  const defaultName = invite.email.split('@')[0] || 'New Member';
  const tempPassword = createTempPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      email: invite.email,
      name: defaultName,
      role: Role.MEMBER,
      password: hashedPassword,
      onboardingComplete: false,
    },
  });

  await prisma.inviteCode.update({
    where: { code: inviteCode },
    data: {
      used: true,
      usedAt: new Date(),
      redeemedById: user.id,
    },
  });

  return user;
};

export const saveProfile = async (payload: SaveProfilePayload) => {
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error('User not found');
  }

  return prisma.user.update({
    where: { id: payload.userId },
    data: {
      name: payload.name ?? user.name,
      dueDate: payload.dueDate ? toDate(payload.dueDate) : user.dueDate,
      location: payload.location ?? user.location,
    },
  });
};

export const assignMentor = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const mentor = await prisma.user.findFirst({
    where: { role: 'MENTOR' },
    orderBy: { createdAt: 'asc' },
  });

  if (!mentor) {
    throw new Error('No mentor available');
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      mentorId: mentor.id,
    },
  });

  return mentor;
};

export const completeOnboarding = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      onboardingComplete: true,
    },
  });
};

export const finishInviteOnboarding = async ({
  code,
  name,
  password,
}: {
  code: string;
  name: string;
  password: string;
}) => {
  const invite = await validateInviteCode(code);
  if (!invite.email) {
    throw new Error('Invite is missing an associated email address');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: invite.email },
  });
  if (existingUser) {
    throw new Error('User already exists for this invite');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: invite.email,
      name,
      password: hashedPassword,
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

  return AuthService.loginUser(invite.email, password);
};

type OnboardingProfilePayload = {
  answers: Prisma.InputJsonValue;
  recommendations: Prisma.InputJsonValue;
  status: string;
};

export const upsertOnboardingProfile = async (userId: string, payload: OnboardingProfilePayload) => {
  return prisma.onboardingProfile.upsert({
    where: { userId },
    create: {
      userId,
      answers: payload.answers,
      recommendations: payload.recommendations,
      status: payload.status,
    },
    update: {
      answers: payload.answers,
      recommendations: payload.recommendations,
      status: payload.status,
    },
  });
};

export const getOnboardingProfile = async (userId: string) => {
  return prisma.onboardingProfile.findUnique({
    where: { userId },
  });
};

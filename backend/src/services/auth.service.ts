import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from '../utils/prisma';
import { signToken } from '../utils/jwt';
import { consumeInvite } from './invite.service';

export type SafeUser = Omit<User, 'password'>;

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  inviteCode: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const toSafeUser = (user: User): SafeUser => {
  const { password, ...rest } = user;
  return rest;
};

const createAuthPayload = (user: User) => ({
  token: signToken({ userId: user.id, role: user.role.toLowerCase() }),
  user: toSafeUser(user),
});

export const registerUser = async (input: RegisterInput) => {
  const { email, password, name, inviteCode } = input;

  if (!inviteCode) {
    throw new Error('Invite code is required');
  }

  const user = await consumeInvite({
    code: inviteCode,
    email,
    password,
    name,
  });

  return createAuthPayload(user);
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    throw new Error('Invalid credentials');
  }

  return createAuthPayload(user);
};

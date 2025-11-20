import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from '../utils/prisma';
import { signToken } from '../utils/jwt';
import { consumeInvite } from './invite.service';
import { MyRegistryService, SignupUserPayload, SignupUserResponse } from './myregistry/myregistry.service';

export type SafeUser = Omit<User, 'password'>;

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  inviteCode?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  registryType?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const toSafeUser = (user: User): SafeUser => {
  const { password, ...rest } = user;
  return rest;
};

const createAuthPayload = (user: User) => {
  const payload = {
    userId: user.id,
    role: user.role.toLowerCase(),
    email: user.email,
    name: user.name ?? undefined,
    myRegistryUserId: user.myRegistryUserId ?? undefined,
    myRegistryEmail: user.myRegistryEmail ?? undefined,
  };

  return {
    token: signToken(payload),
    user: toSafeUser(user),
  };
};

export const registerUser = async (input: RegisterInput) => {
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
  } = input;

  const allowOpenRegistration = process.env.ALLOW_INVITELESS_REGISTRATION === 'true';

  let user: User;

  if (inviteCode) {
    user = await consumeInvite({
      code: inviteCode,
      email,
      password,
      name,
    });
  } else {
    if (!allowOpenRegistration) {
      throw new Error('Invite code is required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: Role.MEMBER,
      },
    });
  }

  const nameParts = (name || '').trim().split(/\s+/);
  const normalizedFirstName = firstName?.trim() || nameParts[0] || '';
  const normalizedLastName = lastName?.trim() || nameParts.slice(1).join(' ') || '';

  const signupPayload: SignupUserPayload = {
    Email: email,
    Password: password,
    FirstName: normalizedFirstName,
    LastName: normalizedLastName,
  };

  if (city) signupPayload.City = city;
  if (state) signupPayload.State = state;
  if (country) signupPayload.Country = country;
  if (registryType) signupPayload.RegistryType = registryType;

  const myRegistryResult: SignupUserResponse = await MyRegistryService.signupUser(signupPayload);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      myRegistryUserId: myRegistryResult.myRegistryUserId || null,
      myRegistryEmail: myRegistryResult.email || email,
    },
  });

  const authPayload = createAuthPayload(updatedUser);

  return {
    ...authPayload,
    myRegistry: myRegistryResult,
  };
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

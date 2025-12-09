import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from '../../prisma/client';
import { signToken } from '../utils/jwt';
import { consumeInvite } from './invite.service';
import { roleRedirect } from '../utils/roleRedirect';
import {
  MyRegistryService,
  SignupUserPayload,
  SignupUserResponse,
} from './myregistry/myregistry.service';

type AuthUserPayload = {
  id: string;
  userId: string;
  email: string;
  name?: string | null;
  role: string;
  onboardingComplete: boolean;
  profileCompleted: boolean;
  inviteCodeUsed: boolean;
};

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

const hasProfile = async (userId: string) => {
  const count = await prisma.profile.count({
    where: { userId },
  });
  return count > 0;
};

const buildAuthUser = (user: User, profileCompleted: boolean): AuthUserPayload => {
  const normalizedRole = user.role.toUpperCase();
  const finalProfileCompleted = user.profileCompleted || profileCompleted;
  const inviteFlag = Boolean(user.inviteCodeUsed);
  return {
    id: user.id,
    userId: user.id,
    email: user.email,
    name: user.name ?? null,
    role: normalizedRole,
    onboardingComplete: user.onboardingComplete,
    profileCompleted: finalProfileCompleted,
    inviteCodeUsed: inviteFlag,
  };
};

const createAuthPayload = (user: User, profileCompleted: boolean) => {
  const authUser = buildAuthUser(user, profileCompleted);

  return {
    token: signToken(authUser),
    user: {
      id: authUser.id,
      email: authUser.email,
      name: authUser.name ?? undefined,
      role: authUser.role,
      onboardingComplete: authUser.onboardingComplete,
      profileCompleted: authUser.profileCompleted,
      inviteCodeUsed: authUser.inviteCodeUsed,
    },
  };
};

type LoginFailureResult = {
  ok: false;
  onboardingRequired: true;
  redirect: '/onboarding';
  error: string;
};

type LoginSuccessResult = ReturnType<typeof createAuthPayload> & {
  ok: true;
  redirect: string;
};

export type LoginResult = LoginFailureResult | LoginSuccessResult;
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

  const profileExists = await hasProfile(updatedUser.id);
  const profileComplete = updatedUser.profileCompleted || profileExists;
  const authPayload = createAuthPayload(updatedUser, profileComplete);

  return {
    ...authPayload,
    myRegistry: myRegistryResult,
  };
};

export const loginUser = async ({ email, password }: LoginInput): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    throw new Error('Invalid credentials');
  }

  const profileExists = await hasProfile(user.id);
  const profileComplete = user.profileCompleted || profileExists;

  const authPayload = createAuthPayload(user, profileComplete);

  return {
    ok: true,
    ...authPayload,
    redirect: roleRedirect(user.role),
  };
};

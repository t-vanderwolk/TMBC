import { Role } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { hashPassword } from '../utils/password';

type SeedUser = {
  email: string;
  role: Role;
  name: string;
  title: string;
};

const DEFAULT_USERS: SeedUser[] = [
  {
    email: 'member@me.com',
    role: Role.MEMBER,
    name: 'Taylor Member',
    title: 'Expecting Parent',
  },
  {
    email: 'mentor@me.com',
    role: Role.MENTOR,
    name: 'Taylor Mentor',
    title: 'Mentor',
  },
  {
    email: 'admin@me.com',
    role: Role.ADMIN,
    name: 'Taylor Admin',
    title: 'Admin',
  },
];

async function ensureProfile(userId: string) {
  try {
    await prisma.profile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
      },
    });
  } catch {
    // If the Profile model does not exist or another error occurs, ignore it.
  }
}

async function main() {
  for (const user of DEFAULT_USERS) {
    const passwordHash = await hashPassword('Karma');
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        disabled: false,
        name: user.name,
        role: user.role,
        password: passwordHash,
      },
      create: {
        email: user.email,
        password: passwordHash,
        role: user.role,
        disabled: false,
        name: user.name,
      },
    });

    await ensureProfile(created.id);

    console.log(
      `Seeded ${user.email} (${user.role})${
        user.title ? ` • ${user.title}` : ''
      }`,
    );
  }

  console.log('Default login users synced.');
}

main()
  .catch((error) => {
    console.error('Failed to seed default users', error);
    process.exit(1);
  })
  .finally(() => process.exit());

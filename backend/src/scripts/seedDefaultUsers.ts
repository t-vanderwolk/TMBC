import { Role } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { hashPassword } from '../utils/password';

async function main() {
  const DEFAULTS = [
    { email: 'member@me.com', role: Role.MEMBER },
    { email: 'mentor@me.com', role: Role.MENTOR },
    { email: 'admin@me.com', role: Role.ADMIN },
  ];

  const passwordHash = await hashPassword('Karma');

  for (const user of DEFAULTS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: passwordHash,
        role: user.role,
      },
    });
  }

  console.log('Default login users synced.');
}

main().finally(() => process.exit());

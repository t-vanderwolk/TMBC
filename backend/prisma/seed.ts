import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const seed = async () => {
  const password = await bcrypt.hash('Karma', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@me.com' },
    update: {},
    create: {
      email: 'admin@me.com',
      password,
      name: 'TMBC Admin',
      role: Role.ADMIN,
    },
  });

  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@me.com' },
    update: {},
    create: {
      email: 'mentor@me.com',
      password,
      name: 'Taylor Mentor',
      role: Role.MENTOR,
    },
  });

  await prisma.invite.upsert({
    where: { code: 'ADMIN-INVITE' },
    update: {},
    create: {
      code: 'ADMIN-INVITE',
      role: Role.MEMBER,
      createdById: admin.id,
    },
  });

  await prisma.invite.upsert({
    where: { code: 'MENTOR-INVITE' },
    update: {},
    create: {
      code: 'MENTOR-INVITE',
      role: Role.MEMBER,
      createdById: mentor.id,
    },
  });

  // placeholder member for dashboard data
  await prisma.user.upsert({
    where: { email: 'member@me.com' },
    update: {},
    create: {
      email: 'member@me.com',
      password,
      name: 'Founding Member',
      role: Role.MEMBER,
    },
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log('Seed complete');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

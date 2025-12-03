import { PrismaClient, Role, WorkbookEntryType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { academyModulesSeed } from './data/academyModulesSeed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TMBC Academy...');

  const passwordHash = await bcrypt.hash('Karma', 10);

  // Users
  const users = [
    { email: 'Admin@me.com', name: 'Admin User', role: Role.ADMIN },
    { email: 'Mentor@me.com', name: 'Mentor User', role: Role.MENTOR },
    { email: 'User@me.com', name: 'Member User', role: Role.MEMBER },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: passwordHash,
        role: user.role,
      },
    });
  }

  // Academy modules
  for (const module of academyModulesSeed) {
    await prisma.academyModule.upsert({
      where: { id: module.id },
      update: {
        title: module.title,
        subtitle: module.subtitle,
        description: module.description,
        heroImage: module.heroImage,
        trackId: module.trackId,
        content: module.content,
      },
      create: {
        id: module.id,
        title: module.title,
        subtitle: module.subtitle,
        description: module.description,
        heroImage: module.heroImage,
        trackId: module.trackId,
        content: module.content,
      },
    });
  }

  console.log('📘 Academy modules seeded with lecture slides!');

  await prisma.adminSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { inviteOnly: true },
  });

  const adminUser = await prisma.user.findUnique({ where: { email: 'Admin@me.com' } });
  if (!adminUser) {
    throw new Error('Admin user should exist after seeding.');
  }

  await prisma.invite.upsert({
    where: { code: 'DEFAULT-ADMIN-INVITE' },
    update: {},
    create: {
      code: 'DEFAULT-ADMIN-INVITE',
      role: Role.MEMBER,
      createdById: adminUser.id,
      maxUses: 50,
      createdAt: new Date(),
    },
  });

  console.log('💌 Default invites seeded');

  await prisma.waitlist.upsert({
    where: { email: 'waitlist@example.com' },
    update: {},
    create: {
      email: 'waitlist@example.com',
      name: 'Waitlist Person',
    },
  });

  console.log('📝 Waitlist seeded');

  const member = await prisma.user.findFirst({ where: { role: Role.MEMBER } });
  const firstModule = academyModulesSeed[0];

  if (member && firstModule) {
    await prisma.workbookEntry.upsert({
      where: {
        userId_moduleId_type: {
          userId: member.id,
          moduleId: firstModule.id,
          type: WorkbookEntryType.JOURNAL,
        },
      },
      update: {
        content: { text: "I'm ready to plan my nursery!" },
      },
      create: {
        userId: member.id,
        moduleId: firstModule.id,
        type: WorkbookEntryType.JOURNAL,
        content: { text: "I'm ready to plan my nursery!" },
      },
    });
  }

  console.log('🧠 Workbook seed complete');
  console.log('🌿 TMBC seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ TMBC seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

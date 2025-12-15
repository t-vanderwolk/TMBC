const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function upsertUser({ email, password, role, name }) {
  if (!email || !password) {
    console.log(`⚠️ Missing env vars for ${role}, skipping`);
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`ℹ️ ${role} already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      role,
      passwordHash,
      emailVerified: true,
      status: "ACTIVE",
    },
  });

  console.log(`✅ Seeded ${role}: ${email}`);
}

async function main() {
  await upsertUser({
    role: Role.ADMIN,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: "Admin",
  });

  await upsertUser({
    role: Role.MENTOR,
    email: process.env.MENTOR_EMAIL,
    password: process.env.MENTOR_PASSWORD,
    name: "Mentor",
  });

  await upsertUser({
    role: Role.MEMBER,
    email: process.env.MEMBER_EMAIL,
    password: process.env.MEMBER_PASSWORD,
    name: "Member",
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

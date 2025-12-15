import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

type SeedTarget = {
  role: Role;
  email?: string;
  password?: string;
  name: string;
};

async function seedUser(target: SeedTarget) {
  const { role, email, password, name } = target;
  if (!email || !password) {
    console.log(`⚠️  Skip ${role}: missing env vars`);
    return;
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    console.log(`ℹ️  ${role} already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
        role,
        disabled: false,
      },
  });

  console.log(`✅ Seeded ${role}: ${email}`);
}

async function main() {
  await seedUser({
    role: Role.ADMIN,
    email: process.env.ADMIN_EMAIL || "admin@tmbc.com",
    password: process.env.ADMIN_PASSWORD || "ChangeMeImmediately123!",
    name: "Admin",
  });

  await seedUser({
    role: Role.MENTOR,
    email: process.env.MENTOR_EMAIL,
    password: process.env.MENTOR_PASSWORD,
    name: "Mentor",
  });

  await seedUser({
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

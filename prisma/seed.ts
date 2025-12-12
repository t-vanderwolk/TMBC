import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedAcademyModules } from "./seedAcademyModules";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TMBC database with correct roles…");
  const passwordHash = await bcrypt.hash("Karma", 12);

  const users = [
    {
      email: "admin@me.com",
      name: "Taylor Admin",
      role: Role.ADMIN,
    },
    {
      email: "mentor@me.com",
      name: "Taylor Mentor",
      role: Role.MENTOR,
    },
    {
      email: "member@me.com",
      name: "Taylor Member",
      role: Role.MEMBER,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        password: passwordHash,
        disabled: false,
        profileCompleted: true,
        inviteCodeUsed: true,
        onboardingComplete: true,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: passwordHash,
        disabled: false,
        profileCompleted: true,
        inviteCodeUsed: true,
        onboardingComplete: true,
      },
    });
  }

  await seedAcademyModules();
}

main()
  .then(() => console.log("🌱 Seed completed successfully."))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

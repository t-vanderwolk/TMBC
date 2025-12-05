// backend/prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = "Karma";
  const passwordHash = await bcrypt.hash(password, 12);

  console.log("🌸 Seeding TMBC core users with synced password 'Karma'…");

  const users = [
    {
      email: "member@me.com",
      name: "Taylor Member",
      role: Role.MEMBER,
    },
    {
      email: "mentor@me.com",
      name: "Taylor Mentor",
      role: Role.MENTOR,
    },
    {
      email: "admin@me.com",
      name: "Taylor Admin",
      role: Role.ADMIN,
    },
  ];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        password: passwordHash, // always resync password to bcrypt("Karma")
        disabled: false,
      },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        password: passwordHash,
        disabled: false,
      },
    });

    console.log(`  ✔ Upserted ${u.role} user: ${user.email}`);
  }

  console.log("✅ Seed complete. You can now log in with:");
  console.log("   member@me.com / Karma");
  console.log("   mentor@me.com / Karma");
  console.log("   admin@me.com  / Karma");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { seedAcademyModules } = require("./seedAcademyModules");

const prisma = new PrismaClient();
const PASSWORD = "Karma";

async function upsertUser({ email, name, role }) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`⏭️  ${role} already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(PASSWORD, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      role,
      password: hashedPassword,
      emailVerified: true,
      status: "ACTIVE",
    },
  });

  console.log(`✅ Seeded ${role}: ${email}`);
}

async function main() {
  console.log("🌱 Starting TMBC seed…");

  // Users
  await upsertUser({ email: "admin@me.com", name: "Admin", role: "ADMIN" });
  await upsertUser({ email: "mentor@me.com", name: "Mentor", role: "MENTOR" });
  await upsertUser({ email: "member@me.com", name: "Member", role: "MEMBER" });

  // Academy
  await seedAcademyModules();

  console.log("🎉 TMBC seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

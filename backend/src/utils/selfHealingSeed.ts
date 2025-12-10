import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function runSelfHealingSeed() {
  console.log("🩺 TMBC Self-Healing Seed: Starting verification…");

  // 1. Verify DB connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("🩺 Database connection OK.");
  } catch (err) {
    console.error("❌ Cannot connect to database.");
    console.error(err);
    return;
  }

  // 2. Define core users — ***REMOVED title (not in schema)***
  const coreUsers = [
    {
      email: "admin@me.com",
      role: Role.ADMIN,
      name: "Taylor Admin",
    },
    {
      email: "mentor@me.com",
      role: Role.MENTOR,
      name: "Taylor Mentor",
    },
    {
      email: "member@me.com",
      role: Role.MEMBER,
      name: "Taylor Member",
    },
  ];

  // bcrypt("Karma")
  const hashedPassword =
    "$2a$10$akXcFB0xtQpFgELPvX4lnuHP0pAgHLO28EwPp85H4U6Tu3JTxE78y";

  // 3. Ensure each exists
  for (const user of coreUsers) {
    try {
      const found = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!found) {
        console.log(`🔧 Creating missing user: ${user.email}`);

        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            role: user.role,
            password: hashedPassword,
          },
        });
      } else {
        console.log(`✔ User exists: ${user.email}`);
      }
    } catch (err) {
      console.error(`❌ Failed to create or verify ${user.email}`);
      console.error(err);
    }
  }

  console.log("🩺 Self-Healing Seed completed.");
}
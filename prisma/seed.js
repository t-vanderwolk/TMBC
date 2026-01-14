/* prisma/seed.js */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const seedAcademyModules = require("./seedAcademyModules");
const seedAffiliates = require("./seedAffiliates");

const prisma = new PrismaClient();
const PASSWORD = "Karma";

/* ----------------------------- USERS ----------------------------- */

async function upsertUser({ email, name, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });

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
      onboardingComplete: true,
      profileCompleted: true,
    },
  });

  console.log(`✅ Seeded ${role}: ${email}`);
}

/* ------------------------- DEMO PRODUCT -------------------------- */

async function seedDemoRegistryProduct() {
  if (process.env.SKIP_DEMO_PRODUCT === "true") {
    console.log("⏭️  Skipping demo registry product");
    return;
  }

  const existing = await prisma.product.findFirst({
    where: { name: "Traveler's Nesting Kit (demo)" },
    select: { id: true },
  });

  if (existing) {
    console.log("⏭️  Demo product already exists");
    return;
  }

  /**
   * IMPORTANT:
   * Use Prisma create() so:
   * - id is auto-generated
   * - defaults are applied
   * - NOT NULL constraints are respected
   */
const product = await prisma.product.create({
  data: {
    name: "Traveler's Nesting Kit (demo)",
    brand: "Taylor-Made",
    category: "Nursery",
    description: "A curated kit for responsive nesting on the go.",
    notes: "DEMO: Mentor-picked for schema preview.",
    imageUrl: "https://images.tmbc.com/demo/demo-product.jpg",
  },
  select: { id: true },
});

 await prisma.affiliateLink.create({
  data: {
    productId: product.id,
    retailerName: "MacroBaby Demo",
    network: "CJ",
    outboundUrl: "https://example.com/demo",
    region: "US",
    isPrimary: true,
  },
});
  console.log("⚡️ Seeded demo registry product & affiliate link");
}

/* ----------------------------- MAIN ------------------------------ */

async function main() {
  console.log("🌱 Starting TMBC seed…");

  await upsertUser({ email: "admin@me.com", name: "Admin", role: "ADMIN" });
  await upsertUser({ email: "mentor@me.com", name: "Mentor", role: "MENTOR" });
  await upsertUser({ email: "member@me.com", name: "Member", role: "MEMBER" });

  await prisma.user.updateMany({
    where: { email: "member@me.com" },
    data: {
      onboardingComplete: true,
      profileCompleted: true,
    },
  });

  await seedAcademyModules();
  await seedDemoRegistryProduct();
  await seedAffiliates();

  console.log("🎉 TMBC seed complete");
}

/* --------------------------- RUNNER ------------------------------ */

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const seedAcademyModules = require("./seedAcademyModules");

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

  // Demo product for registry metadata preview (demo data only)
  await seedDemoRegistryProduct();

  console.log("🎉 TMBC seed complete");
}

async function seedDemoRegistryProduct() {
  const existing = await prisma.product.findFirst({
    where: { name: "Traveler's Nesting Kit (demo)" },
  });

  if (existing) {
    return;
  }

  const product = await prisma.product.create({
    data: {
      name: "Traveler's Nesting Kit (demo)",
      brand: "Taylor-Made",
      category: "Nursery",
      description: "A curated kit for responsive nesting on the go.",
      notes: "DEMO: Mentor-picked for schema preview.",
    },
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

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

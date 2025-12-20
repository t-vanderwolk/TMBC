import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import seedAcademyModules from "./seedAcademyModules.mjs";

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
  if (process.env.SKIP_DEMO_PRODUCT === 'true') {
    console.log('⏭️  Skipping demo registry product (SKIP_DEMO_PRODUCT=true)');
    return;
  }

  const desiredColumns = [
    { name: "name", value: "Traveler's Nesting Kit (demo)" },
    { name: "brand", value: "Taylor-Made" },
    { name: "category", value: "Nursery" },
    { name: "description", value: "A curated kit for responsive nesting on the go." },
    { name: "notes", value: "DEMO: Mentor-picked for schema preview." },
  ];

  const columnRows = await prisma.$queryRawUnsafe(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = current_schema() AND table_name = 'Product'`,
  );
  const columns = new Set(columnRows.map((row) => row.column_name));

  if (!columns.has("name") || !columns.has("category")) {
    console.warn("⚠️  Skipping demo product seed because required columns are missing.");
    return;
  }

  const existing =
    (await prisma.$queryRawUnsafe(
      `SELECT id FROM "Product" WHERE name = $1 LIMIT 1`,
      "Traveler's Nesting Kit (demo)",
    ))[0];

  if (existing) {
    return;
  }

  const insertColumns = [];
  const insertValues = [];
  for (const column of desiredColumns) {
    if (columns.has(column.name)) {
      insertColumns.push(`"${column.name}"`);
      insertValues.push(column.value);
    }
  }

  const placeholders = insertValues.map((_, index) => `$${index + 1}`);
  const inserted =
    await prisma.$queryRawUnsafe(
      `INSERT INTO "Product" (${insertColumns.join(", ")})
       VALUES (${placeholders.join(", ")})
       RETURNING id`,
      ...insertValues,
    );
  const product = inserted?.[0];
  if (!product?.id) {
    throw new Error("Unable to seed demo product");
  }

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

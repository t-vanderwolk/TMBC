const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Academy module seed data
 */
const academyModules = [
  // ⬅️ KEEP YOUR ENTIRE ARRAY EXACTLY AS-IS
  // (no changes needed to the data itself)
  // ...
];

/**
 * Seed Academy Modules
 */
async function seedAcademyModules() {
  console.log("🌸 Seeding Academy Modules…");

  try {
    for (const mod of academyModules) {
      const metadata = mod.content?.metadata ?? {};

      const modulePayload = {
        id: mod.id,
        slug: mod.slug,
        title: mod.title,
        subtitle: mod.subtitle ?? null,
        description: mod.description ?? null,
        journey: mod.journey,
        content: mod.content,
        published: metadata.isPublished === true,
        order: metadata.order ?? 0,
      };

      await prisma.academyModule.upsert({
        where: { id: mod.id },
        update: modulePayload,
        create: modulePayload,
      });
    }

    console.log("✨ Academy modules seeded successfully!");
  } catch (err) {
    console.error("❌ Academy module seed failed", err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { seedAcademyModules };
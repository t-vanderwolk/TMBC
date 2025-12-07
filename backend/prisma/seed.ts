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

  const memberUser = await prisma.user.findUnique({ where: { email: "member@me.com" } });
  const mentorUser = await prisma.user.findUnique({ where: { email: "mentor@me.com" } });

  if (memberUser && mentorUser) {
    const rooms = [
      {
        id: "community-room-nursery",
        name: "Nursery Atelier",
        description: "Share styling wins, palettes, and bedtime rituals for your dream nursery.",
      },
      {
        id: "community-room-feeding",
        name: "Feeding Circle",
        description: "Discuss pumping rhythms, feeding cues, and postpartum nourishment.",
      },
    ];

    for (const room of rooms) {
      await prisma.communityRoom.upsert({
        where: { id: room.id },
        update: {
          name: room.name,
          description: room.description,
        },
        create: room,
      });
    }

    const posts = [
      {
        id: "community-post-nursery-1",
        roomId: "community-room-nursery",
        userId: memberUser.id,
        content: "Just layered a mauve rug with ivory rattan—passing by in the community to ask how you balance soft light during feedings.",
      },
      {
        id: "community-post-feeding-1",
        roomId: "community-room-feeding",
        userId: mentorUser.id,
        content: "Sharing a mini ritual for anxious evenings: dim the lights, sip chamomile, and lean into the lullaby playlist.",
      },
    ];

    for (const post of posts) {
      await prisma.communityPost.upsert({
        where: { id: post.id },
        update: {
          content: post.content,
          roomId: post.roomId,
          userId: post.userId,
        },
        create: post,
      });
    }
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

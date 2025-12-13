import { PrismaClient, Role, AffiliateNetwork } from "@prisma/client";
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

  const [memberUser, mentorUser] = await Promise.all([
    prisma.user.findUnique({ where: { email: "member@me.com" } }),
    prisma.user.findUnique({ where: { email: "mentor@me.com" } }),
  ]);

  const rooms = [
    {
      name: "Community studio",
      description: "A calm place for members to reflect and share small wins.",
      minRole: Role.MEMBER,
    },
    {
      name: "Mentor lounge",
      description: "Mentors sync here before circle hours.",
      minRole: Role.MENTOR,
    },
  ];

  const createdRooms = [];
  for (const room of rooms) {
    const record = await prisma.communityRoom.upsert({
      where: { name: room.name },
      update: {
        description: room.description,
        minRole: room.minRole,
      },
      create: {
        name: room.name,
        description: room.description,
        minRole: room.minRole,
      },
    });
    createdRooms.push(record);
  }

  const memberRoom = createdRooms.find((room) => room.name === "Community studio");
  if (memberUser && memberRoom) {
    const exampleContent = "Sharing that the nursery curtains are done—thanks for the gentle nudges!";
    let purposePost = await prisma.communityPost.findFirst({
      where: {
        roomId: memberRoom.id,
        userId: memberUser.id,
        content: exampleContent,
      },
    });
    if (!purposePost) {
      purposePost = await prisma.communityPost.create({
        data: {
          roomId: memberRoom.id,
          userId: memberUser.id,
          content: exampleContent,
        },
      });
    }

    if (mentorUser && purposePost) {
      const replyContent = "Love it—soft light, softer intentions. Keep us posted.";
      const existingReply = await prisma.communityReply.findFirst({
        where: {
          postId: purposePost.id,
          userId: mentorUser.id,
          content: replyContent,
        },
      });
      if (!existingReply) {
        await prisma.communityReply.create({
          data: {
            postId: purposePost.id,
            userId: mentorUser.id,
            content: replyContent,
          },
        });
      }
    }
  }

  await seedAffiliatePartners();
}

const AFFILIATE_PARTNERS = [
  {
    id: "88335",
    name: "MyRegistry",
    network: AffiliateNetwork.AWIN,
    awinmid: 88335,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: "https://www.myregistry.com",
  },
  {
    id: "112996",
    name: "WAYB (US)",
    network: AffiliateNetwork.AWIN,
    awinmid: 112996,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
  {
    id: "116081",
    name: "dadada Baby",
    network: AffiliateNetwork.AWIN,
    awinmid: 116081,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
  {
    id: "105619",
    name: "Jool Baby",
    network: AffiliateNetwork.AWIN,
    awinmid: 105619,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
  {
    id: "117269",
    name: "Le Lolo Postpartum",
    network: AffiliateNetwork.AWIN,
    awinmid: 117269,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
  {
    id: "68376",
    name: "Bella Luna Toys",
    network: AffiliateNetwork.AWIN,
    awinmid: 68376,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
  {
    id: "93345",
    name: "Make-A-Fort",
    network: AffiliateNetwork.AWIN,
    awinmid: 93345,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
  {
    id: "121240",
    name: "Petit from Poa",
    network: AffiliateNetwork.AWIN,
    awinmid: 121240,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
  {
    id: "44153",
    name: "Inklings Baby",
    network: AffiliateNetwork.AWIN,
    awinmid: 44153,
    cookieDays: 30,
    regions: ["US"],
    defaultLink: null,
  },
];

async function seedAffiliatePartners() {
  for (const partner of AFFILIATE_PARTNERS) {
    await prisma.affiliatePartner.upsert({
      where: { id: partner.id },
      update: {
        name: partner.name,
        network: partner.network,
        awinmid: partner.awinmid,
        cookieDays: partner.cookieDays,
        regions: partner.regions,
        defaultLink: partner.defaultLink,
      },
      create: {
        id: partner.id,
        name: partner.name,
        network: partner.network,
        awinmid: partner.awinmid,
        cookieDays: partner.cookieDays,
        regions: partner.regions,
        defaultLink: partner.defaultLink,
      },
    });
  }
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

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const academyModules = [
  {
    id: "nursery-vision",
    journey: "NURSERY",
    title: "Vision & Foundations",
    subtitle: "Creating your nursery’s emotional blueprint",
    description:
      "A grounding introduction to how space, routines, and sensory choices shape your home before baby arrives.",
    order: 1,
  },
  {
    id: "nursery-core",
    journey: "NURSERY",
    title: "Core Furniture & Layout",
    subtitle: "Safety, spacing, and functional beauty",
    description:
      "Learn the essentials of crib placement, changing stations, seating, and storage that grows with your family.",
    order: 2,
  },
  {
    id: "nursery-atmosphere",
    journey: "NURSERY",
    title: "Atmosphere & Safety",
    subtitle: "Lighting, sound, temperature, monitoring",
    description:
      "Shape the sensory experience of your nursery with safe, developmentally aligned choices.",
    order: 3,
  },
  {
    id: "nursery-decor",
    journey: "NURSERY",
    title: "Details & Decor",
    subtitle: "Finishing touches for calm and beauty",
    description:
      "Learn how color, scale, motifs, and styling choices influence baby's sense of security.",
    order: 4,
  },
  {
    id: "nursery-ready",
    journey: "NURSERY",
    title: "Ready for Baby",
    subtitle: "Preparing the space for day one",
    description:
      "A complete walkthrough of setup, stocking, prepping, and making the nursery functional.",
    order: 5,
  },
  {
    id: "gear-mobility",
    journey: "GEAR",
    title: "Mobility & Bonding",
    subtitle: "Strollers, carriers, travel choices",
    description:
      "Master stroller categories, car seat compatibility, babywearing, and movement-based bonding.",
    order: 6,
  },
  {
    id: "gear-feeding",
    journey: "GEAR",
    title: "Feeding & Seating",
    subtitle: "Bottles, pumps, utensils, and high chairs",
    description:
      "A complete breakdown of feeding equipment, safety standards, and functional choices.",
    order: 7,
  },
  {
    id: "gear-sleep",
    journey: "GEAR",
    title: "Sleep & Comfort",
    subtitle: "Bassinet, crib, swaddles, sound machines",
    description:
      "Everything you need to understand safe sleep equipment and soothing devices.",
    order: 8,
  },
  {
    id: "gear-bath",
    journey: "GEAR",
    title: "Bath & Hygiene Essentials",
    subtitle: "Tubs, grooming, diapering, and cleanliness",
    description:
      "Learn safe bathing setups, hygiene routines, and daily care essentials.",
    order: 9,
  },
  {
    id: "postpartum-healing",
    journey: "POSTPARTUM",
    title: "Healing & Wellness",
    subtitle: "Your body after birth",
    description:
      "A realistic, gentle look at recovery, rest, nourishment, and redefining movement.",
    order: 10,
  },
  {
    id: "postpartum-feeding",
    journey: "POSTPARTUM",
    title: "Feeding & Lactation Wellness",
    subtitle: "Navigating breastfeeding, pumping, or combo-feeding",
    description:
      "Supportive guidance on latch, supply, nutrition, troubleshooting, and emotional well-being.",
    order: 11,
  },
  {
    id: "postpartum-emotions",
    journey: "POSTPARTUM",
    title: "Emotional & Relationship Wellness",
    subtitle: "Identity, intimacy, and communication",
    description:
      "Tools for navigating emotional shifts, relationship changes, and rebuilding closeness.",
    order: 12,
  },
  {
    id: "postpartum-support",
    journey: "POSTPARTUM",
    title: "Support & Care Network",
    subtitle: "Doulas, nannies, wet nurses, partners, family",
    description:
      "Build a realistic and sustainable support system tailored to your lifestyle.",
    order: 13,
  },
];

export async function seedAcademyModules() {
  console.log("🌸 Seeding Academy Modules…");

  for (const mod of academyModules) {
    await prisma.academyModule.upsert({
      where: { id: mod.id },
      update: mod,
      create: mod,
    });
  }

  console.log("✨ Academy modules seeded successfully!");
}

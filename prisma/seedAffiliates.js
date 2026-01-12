const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

const CANONICAL_AFFILIATES = [
  {
    name: "Make-A-Fort, LLC",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "5%",
    categories: ["Gear"],
    registryEligible: true,
    blogEligible: true,
  },
  {
    name: "Owlet Baby Care Inc.",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "6%",
    categories: ["Sleep"],
    registryEligible: true,
  },
  {
    name: "Bungle Nursery Cribs",
    network: "AWIN",
    role: "BRAND",
    status: "AT_RISK",
    commissionRate: "4%",
    categories: ["Nursery"],
  },
  {
    name: "dadada Baby",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "5%",
    categories: ["Gear"],
  },
  {
    name: "Bella Luna Toys",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "4%",
    categories: ["Toys"],
  },
  {
    name: "Inklings Baby",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "6%",
    categories: ["Registry"],
  },
  {
    name: "MyRegistry.com",
    network: "AWIN",
    role: "INFRASTRUCTURE",
    status: "ACTIVE",
    commissionRate: null,
    blogEligible: false,
    registryEligible: false,
    mentorVisible: true,
    categories: ["Infrastructure"],
  },
  {
    name: "Petit from Poa",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "6%",
    categories: ["Gear"],
  },
  {
    name: "Inglesina",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "5%",
    categories: ["Gear"],
  },
  {
    name: "The Uptown Baby",
    network: "AWIN",
    role: "RETAILER",
    status: "ACTIVE",
    commissionRate: "3%",
    categories: ["Retailer"],
    registryEligible: true,
    retailerTier: "Tier-2",
    priority: 2,
  },
  {
    name: "ERGO Baby Carrier, Inc.",
    network: "AWIN",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "5%",
    categories: ["Gear"],
  },
  {
    name: "Albee Baby",
    network: "CJ",
    role: "RETAILER",
    status: "ACTIVE",
    commissionRate: "2%",
    categories: ["Retailer"],
    registryEligible: true,
    retailerTier: "Tier-1",
    priority: 1,
    affiliateIds: {
      CJ: "Advertiser 4488778 | PID 101548494",
    },
  },
  {
    name: "BC Babycare",
    network: "CJ",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "10%",
    categories: ["Gear"],
  },
  {
    name: "Coco Moon Hawai‘i",
    network: "CJ",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "3%",
    categories: ["Gear"],
  },
  {
    name: "Colugo",
    network: "CJ",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "8%",
    categories: ["Gear"],
  },
  {
    name: "SlumberPod",
    network: "CJ",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "5%",
    categories: ["Gear"],
  },
  {
    name: "Babeside",
    network: "IMPACT",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "20%",
    categories: ["Gear"],
  },
  {
    name: "Angelbliss",
    network: "IMPACT",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "10%",
    categories: ["Gear"],
  },
  {
    name: "Mustela USA",
    network: "IMPACT",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "8%",
    categories: ["Skin Care"],
  },
  {
    name: "Kids2Shop",
    network: "IMPACT",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "7%",
    categories: ["Gear"],
  },
  {
    name: "Pish Posh Baby",
    network: "IMPACT",
    role: "RETAILER",
    status: "ACTIVE",
    commissionRate: "6%",
    categories: ["Retailer"],
    registryEligible: true,
    retailerTier: "Tier-2",
    priority: 3,
  },
  {
    name: "Happiest Baby",
    network: "IMPACT",
    role: "BRAND",
    status: "ACTIVE",
    commissionRate: "$25 per SNOO rental",
    categories: ["Gear"],
  },
];

const metadataPath = path.resolve(__dirname, "../data/admin-affiliate-metadata.json");

function loadMetadata() {
  try {
    const raw = fs.readFileSync(metadataPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { partners: {} };
  }
}

function persistMetadata(metadata) {
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + "\n", "utf-8");
}

function buildVisibility(entry, existing) {
  const prior = existing?.visibility ?? {};
  return {
    blogEligible: entry.blogEligible ?? prior.blogEligible ?? entry.role !== "INFRASTRUCTURE",
    registryEligible: entry.registryEligible ?? prior.registryEligible ?? false,
    mentorVisible: entry.mentorVisible ?? prior.mentorVisible ?? true,
  };
}

function buildBlogSettings(entry, existing) {
  const prior = existing?.blogSettings ?? {};
  return {
    eligible: entry.blogEligible ?? prior.eligible ?? entry.role !== "INFRASTRUCTURE",
    defaultCta: prior.defaultCta ?? entry.blogCta ?? "Shop",
    placement: "END_CARD",
    primaryEligible: prior.primaryEligible ?? true,
  };
}

function buildRegistrySettings(entry, existing) {
  const prior = existing?.registrySettings ?? {};
  return {
    retailerTier: entry.retailerTier ?? prior.retailerTier,
    priority:
      entry.priority ??
      (typeof prior.priority === "number" ? prior.priority : undefined),
    categoryExclusions: entry.categoryExclusions ?? prior.categoryExclusions ?? [],
    fallbackToBrandDirect: entry.fallbackToBrandDirect ?? prior.fallbackToBrandDirect ?? false,
  };
}

async function seed() {
  const prisma = new PrismaClient();
  const metadata = loadMetadata();
  const created = [];
  const updated = [];
  const skipped = [];

  for (const affiliate of CANONICAL_AFFILIATES) {
    const targetCreate = {
      id: randomUUID(),
      name: affiliate.name,
      network: affiliate.network,
      defaultLink: null,
    };
    const existing = await prisma.affiliatePartner.findFirst({ where: { name: affiliate.name } });
    const needsUpdate =
      existing &&
      (existing.network !== affiliate.network || existing.defaultLink !== null);

    if (existing) {
      await prisma.affiliatePartner.update({
        where: { id: existing.id },
        data: {
          name: affiliate.name,
          network: affiliate.network,
          defaultLink: null,
        },
      });
    } else {
      await prisma.affiliatePartner.create({
        data: targetCreate,
      });
    }

    if (!existing) {
      created.push(affiliate.name);
    } else if (needsUpdate) {
      updated.push(affiliate.name);
    } else {
      skipped.push(affiliate.name);
    }

    const existingMeta = metadata.partners[affiliate.name] ?? {};
    metadata.partners[affiliate.name] = {
      ...existingMeta,
      category: affiliate.categories?.[0] ?? existingMeta.category ?? null,
      role: affiliate.role,
      commissionRate: affiliate.commissionRate ?? affiliate.payoutModel ?? existingMeta.commissionRate ?? null,
      status: affiliate.status,
      visibility: buildVisibility(affiliate, existingMeta),
      blogSettings: buildBlogSettings(affiliate, existingMeta),
      registrySettings: buildRegistrySettings(affiliate, existingMeta),
      affiliateIds: {
        ...(existingMeta.affiliateIds ?? {}),
        ...(affiliate.affiliateIds ?? {}),
      },
      internalNotes: affiliate.internalNotes ?? existingMeta.internalNotes ?? null,
    };
  }

  persistMetadata(metadata);
  await prisma.$disconnect();

  console.log("Affiliate sync complete.");
  console.log("Created affiliates:", created.length ? created.join(", ") : "none");
  console.log("Updated affiliates:", updated.length ? updated.join(", ") : "none");
  console.log("Skipped (no change):", skipped.length ? skipped.join(", ") : "none");
}

if (require.main === module) {
  seed().catch((error) => {
    console.error("Affiliate seed failed:", error);
    process.exit(1);
  });
}

module.exports = seed;

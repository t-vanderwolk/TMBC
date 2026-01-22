import { appendQueryParams } from "@/lib/affiliates/routing";

export type AffiliateNetwork =
  | "CJ"
  | "AWIN"
  | "IMPACT"
  | "DIRECT"
  | "MYREGISTRY"
  | "SHAREASALE";
export type PayoutModel = "percent_sale" | "fixed_sale" | "cpl" | "rental" | "mixed";
export type AffiliateType = "product" | "service" | "lead";
export type AffiliateSurface = "blog" | "registry" | "academy" | "mentor" | "mentorSuggestions";

type AllowedSurfaces = Record<AffiliateSurface, boolean>;

export type AffiliateCanonEntry = {
  id: string;
  name: string;
  network: AffiliateNetwork;
  website: string;
  categories: string[];
  regions: string[];
  payoutModel: PayoutModel;
  commissionMin?: number;
  commissionMax?: number;
  fixedCommission?: number;
  payoutValue?: number;
  cookieLength?: number;
  type?: AffiliateType;
  merchantId?: string;
  notes?: string;
  restrictions?: {
    coupons?: boolean;
    social?: boolean;
    email?: boolean;
    search?: boolean;
    trademarkTerms?: string[];
  };
  allowedSurfaces: AllowedSurfaces;
  priorityTier: "tier1" | "tier2" | "discovery" | "admin";
  isPaused?: boolean;
};

const insideUs: string[] = ["US"];

const tierOneSurfaces: AllowedSurfaces = {
  blog: true,
  registry: true,
  academy: false,
  mentor: true,
  mentorSuggestions: true,
};

const tierTwoSurfaces: AllowedSurfaces = {
  blog: true,
  registry: true,
  academy: false,
  mentor: true,
  mentorSuggestions: true,
};

const discoverySurfaces: AllowedSurfaces = {
  blog: true,
  registry: false,
  academy: false,
  mentor: false,
  mentorSuggestions: false,
};

const directSurfaces: AllowedSurfaces = {
  blog: true,
  registry: true,
  academy: false,
  mentor: true,
  mentorSuggestions: true,
};

const AWIN_TIER1_ENTRIES: AffiliateCanonEntry[] = [
  {
    id: "awin-wayb",
    name: "WAYB",
    network: "AWIN",
    website: "https://waybhome.com",
    categories: ["core gear", "registry"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-inglesina",
    name: "Inglesina",
    network: "AWIN",
    website: "https://www.inglesina.com",
    categories: ["travel", "core gear"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-ergobaby",
    name: "Ergobaby",
    network: "AWIN",
    website: "https://ergobaby.com",
    categories: ["wearing", "core gear"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-owlet",
    name: "Owlet Baby Care",
    network: "AWIN",
    website: "https://owletcare.com",
    categories: ["sleep", "monitoring"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-kyte-baby",
    name: "Kyte Baby",
    network: "AWIN",
    website: "https://www.kytebaby.com",
    categories: ["essentials", "textiles"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-baby-trend",
    name: "Baby Trend",
    network: "AWIN",
    website: "https://www.babytrend.com",
    categories: ["gear", "registry"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-dadada",
    name: "dadada Baby",
    network: "AWIN",
    website: "https://www.dadadababy.com",
    categories: ["gear", "design-forward"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-snuggle-me",
    name: "Snuggle Me Organic",
    network: "AWIN",
    website: "https://www.snugglemeorganic.com",
    categories: ["sleep", "textiles"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-uptown-baby",
    name: "The Uptown Baby",
    network: "AWIN",
    website: "https://uptownbaby.com",
    categories: ["registry", "furniture"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "awin-jool-baby",
    name: "Jool Baby",
    network: "AWIN",
    website: "https://www.joolbaby.com",
    categories: ["feeding", "registry"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierOneSurfaces,
    priorityTier: "tier1",
  },
];

const AWIN_TIER2_ENTRIES: AffiliateCanonEntry[] = [
  {
    id: "awin-bella-luna",
    name: "Bella Luna Toys",
    network: "AWIN",
    website: "https://bellalunatoys.com",
    categories: ["lifestyle", "support"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-make-a-fort",
    name: "Make-A-Fort",
    network: "AWIN",
    website: "https://www.makeafort.com",
    categories: ["lifestyle", "support"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-inklings",
    name: "Inklings Baby",
    network: "AWIN",
    website: "https://inklingsbaby.com",
    categories: ["lifestyle", "support"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-baby-shusher",
    name: "Baby Shusher",
    network: "AWIN",
    website: "https://www.babyshusher.com",
    categories: ["sleep", "support"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-babys-brew",
    name: "The Baby's Brew",
    network: "AWIN",
    website: "https://thebabysbrew.com",
    categories: ["feeding", "support"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-le-lolo",
    name: "Le Lolo Postpartum",
    network: "AWIN",
    website: "https://lelo.co",
    categories: ["postpartum", "support"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-petit-from-poa",
    name: "Petit from Poa",
    network: "AWIN",
    website: "https://petitfrompoa.com",
    categories: ["lifestyle", "decor"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-timo-violet",
    name: "Timo & Violet",
    network: "AWIN",
    website: "https://timoviolet.com",
    categories: ["textiles", "decor"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-babu-bath",
    name: "Babu Bath",
    network: "AWIN",
    website: "https://babubath.com",
    categories: ["bathing", "lifestyle"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
  {
    id: "awin-bungle-nursery",
    name: "Bungle Nursery Cribs",
    network: "AWIN",
    website: "https://bunglenursery.com",
    categories: ["furniture", "registry"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: tierTwoSurfaces,
    priorityTier: "tier2",
  },
];

const AWIN_DISCOVERY_ENTRIES: AffiliateCanonEntry[] = [
  {
    id: "awin-bella-luna-discovery",
    name: "Bella Luna Toys (Discovery)",
    network: "AWIN",
    website: "https://bellalunatoys.com",
    categories: ["lifestyle", "discovery"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: discoverySurfaces,
    priorityTier: "discovery",
    notes: "Editorial focus on toys & enrichment pieces.",
  },
  {
    id: "awin-inklings-discovery",
    name: "Inklings Baby (Discovery)",
    network: "AWIN",
    website: "https://inklingsbaby.com",
    categories: ["lifestyle", "discovery"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: discoverySurfaces,
    priorityTier: "discovery",
    notes: "Wellness & lifestyle-focused parents.",
  },
  {
    id: "awin-make-a-fort-discovery",
    name: "Make-A-Fort (Discovery)",
    network: "AWIN",
    website: "https://www.makeafort.com",
    categories: ["play", "discovery"],
    regions: insideUs,
    payoutModel: "percent_sale",
    allowedSurfaces: discoverySurfaces,
    priorityTier: "discovery",
    notes: "Content-led monetization for inventive toys.",
  },
];

const DIRECT_ENTRIES: AffiliateCanonEntry[] = [
  {
    id: "direct-modern-nursery",
    name: "Modern Nursery",
    network: "DIRECT",
    website: "https://modernnursery.com",
    categories: ["furniture", "core gear"],
    regions: insideUs,
    payoutModel: "percent_sale",
    commissionMin: 5,
    commissionMax: 5,
    allowedSurfaces: directSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "direct-macrobaby",
    name: "MacroBaby",
    network: "DIRECT",
    website: "https://macrobaby.com",
    categories: ["registry", "core gear"],
    regions: insideUs,
    payoutModel: "percent_sale",
    commissionMin: 5,
    commissionMax: 5,
    allowedSurfaces: directSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "direct-anb-baby",
    name: "ANB Baby",
    network: "DIRECT",
    website: "https://anbbaby.com",
    categories: ["registry", "core gear"],
    regions: insideUs,
    payoutModel: "percent_sale",
    commissionMin: 5,
    commissionMax: 5,
    allowedSurfaces: directSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "direct-silver-cross",
    name: "Silver Cross",
    network: "DIRECT",
    website: "https://silvercrossus.com",
    categories: ["core gear", "travel"],
    regions: insideUs,
    payoutModel: "percent_sale",
    commissionMin: 15,
    commissionMax: 15,
    allowedSurfaces: directSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "direct-babyquip",
    name: "BabyQuip",
    network: "DIRECT",
    website: "https://babyquip.com",
    categories: ["services", "gear"],
    regions: insideUs,
    payoutModel: "percent_sale",
    commissionMin: 10,
    commissionMax: 10,
    allowedSurfaces: directSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "direct-bebcare",
    name: "Bebcare",
    network: "DIRECT",
    website: "https://bebcare.com",
    categories: ["services", "gear"],
    regions: insideUs,
    payoutModel: "percent_sale",
    commissionMin: 15,
    commissionMax: 15,
    allowedSurfaces: directSurfaces,
    priorityTier: "tier1",
  },
  {
    id: "direct-newborn-nursery",
    name: "Newborn Nursery Furniture",
    network: "DIRECT",
    website: "https://newbornnursery.com",
    categories: ["furniture", "registry"],
    regions: insideUs,
    payoutModel: "percent_sale",
    commissionMin: 5,
    commissionMax: 5,
    allowedSurfaces: directSurfaces,
    priorityTier: "tier1",
  },
];

const CJ_ENTRIES: AffiliateCanonEntry[] = [];
const IMPACT_ENTRIES: AffiliateCanonEntry[] = [];

export const MYREGISTRY_SIGNUP_COMPLETED = "MYREGISTRY_SIGNUP_COMPLETED";

export const MYREGISTRY_CANON: AffiliateCanonEntry = {
  id: "awin-myregistry",
  name: "MyRegistry.com",
  network: "MYREGISTRY",
  website: "https://www.myregistry.com",
  categories: ["registry"],
  regions: insideUs,
  payoutModel: "cpl",
  fixedCommission: 1.5,
  payoutValue: 1.5,
  type: "lead",
  merchantId: "88335",
  allowedSurfaces: {
    blog: false,
    registry: false,
    academy: false,
    mentor: false,
    mentorSuggestions: false,
  },
  priorityTier: "admin",
  notes: "Administrative attribution only — never surfaced publicly.",
};

export const AFFILIATE_CANON: AffiliateCanonEntry[] = [
  MYREGISTRY_CANON,
  ...DIRECT_ENTRIES,
  ...CJ_ENTRIES,
  ...IMPACT_ENTRIES,
  ...AWIN_TIER1_ENTRIES,
  ...AWIN_TIER2_ENTRIES,
  ...AWIN_DISCOVERY_ENTRIES,
];

const affiliateCanonById = new Map<string, AffiliateCanonEntry>(
  AFFILIATE_CANON.map((entry) => [entry.id, entry]),
);

export const getAffiliateCanonEntry = (id: string) => affiliateCanonById.get(id);

const affiliateCanonByName = new Map<string, AffiliateCanonEntry[]>();

const normalizeName = (value: string | undefined | null): string =>
  (value ?? "").trim().toLowerCase();

AFFILIATE_CANON.forEach((entry) => {
  const key = normalizeName(entry.name);
  const list = affiliateCanonByName.get(key) ?? [];
  list.push(entry);
  affiliateCanonByName.set(key, list);
});

export function findCanonEntriesByBrand(brand: string): AffiliateCanonEntry[] {
  const key = normalizeName(brand);
  return affiliateCanonByName.get(key) ?? [];
}

export type AffiliateLinkResolutionStatus =
  | "resolved"
  | "restricted"
  | "missing"
  | "paused";

export type AffiliateLinkResolution = {
  href: string;
  affiliateId: string;
  canonicalName?: string;
  network: AffiliateNetwork | "UNKNOWN";
  priorityTier: AffiliateCanonEntry["priorityTier"] | "discovery";
  surface: AffiliateSurface;
  status: AffiliateLinkResolutionStatus;
  analyticsPayload: {
    event: "affiliateLinkResolved";
    affiliateId: string;
    network: AffiliateNetwork | "UNKNOWN";
    priorityTier: AffiliateCanonEntry["priorityTier"] | "discovery";
    surface: AffiliateSurface;
  };
};

const NETWORK_TRACKING_PARAMS: Record<AffiliateNetwork, Record<string, string>> = {
  AWIN: { clickref: "tmbc" },
  CJ: { sid: "tmbc" },
  IMPACT: { subid: "tmbc" },
  DIRECT: { ref: "tmbc" },
  MYREGISTRY: { clickref: "tmbc" },
  SHAREASALE: { sid: "tmbc" },
};

export type GetAffiliateLinkArgs = {
  affiliateId: string;
  destinationUrl: string;
  surface?: AffiliateSurface;
};

export function getAffiliateLink({
  affiliateId,
  destinationUrl,
  surface = "blog",
}: GetAffiliateLinkArgs): AffiliateLinkResolution {
  const entry = getAffiliateCanonEntry(affiliateId);
  const base: AffiliateLinkResolution = {
    href: destinationUrl,
    affiliateId,
    canonicalName: entry?.name,
    network: entry?.network ?? "UNKNOWN",
    priorityTier: entry?.priorityTier ?? "discovery",
    surface,
    status: entry ? "resolved" : "missing",
    analyticsPayload: {
      event: "affiliateLinkResolved",
      affiliateId,
      network: entry?.network ?? "UNKNOWN",
      priorityTier: entry?.priorityTier ?? "discovery",
      surface,
    },
  };

  if (!entry) {
    return base;
  }

  if (entry.isPaused) {
    return { ...base, status: "paused" };
  }

  if (!entry.allowedSurfaces[surface]) {
    return { ...base, status: "restricted" };
  }

  const tracking = NETWORK_TRACKING_PARAMS[entry.network] ?? {};
  const href = appendQueryParams(destinationUrl, tracking);

  return {
    ...base,
    href,
    status: "resolved",
    analyticsPayload: {
      ...base.analyticsPayload,
      event: "affiliateLinkResolved",
    },
  };
}

import type { AffiliatePartner } from "@prisma/client";

import {
  AffiliateCanonEntry,
  AffiliateLinkResolutionStatus,
  AffiliateNetwork,
  AffiliateSurface,
  MYREGISTRY_CANON,
  findCanonEntriesByBrand,
} from "@/lib/constants/affiliateCanon";

export type AdminAffiliateOverride = {
  affiliateId: string;
  name: string;
  network: AffiliateNetwork;
  allowedSurfaces?: AffiliateSurface[];
  isPaused?: boolean;
};

export type ResolveAffiliateOptions = {
  brand?: string | null;
  surface: AffiliateSurface;
  adminOverrides?: AdminAffiliateOverride[];
};

export type ResolveAffiliateResult = {
  affiliateId: string;
  affiliateName: string;
  network: AffiliateNetwork | "UNKNOWN";
  surface: AffiliateSurface;
  status: AffiliateLinkResolutionStatus;
  canonicalEntry?: AffiliateCanonEntry;
  adminOverride?: AdminAffiliateOverride;
};

const priorityOrder: Record<AffiliateCanonEntry["priorityTier"], number> = {
  tier1: 1,
  tier2: 2,
  discovery: 3,
  admin: 4,
};

const normalizeBrand = (value: string | undefined | null) =>
  (value ?? "").trim().toLowerCase();

const createCanonicalResolution = (
  entry: AffiliateCanonEntry,
  surface: AffiliateSurface,
): ResolveAffiliateResult => ({
  affiliateId: entry.id,
  affiliateName: entry.name,
  network: entry.network,
  surface,
  status: entry.isPaused ? "paused" : "resolved",
  canonicalEntry: entry,
});

const createAdminResolution = (
  override: AdminAffiliateOverride,
  surface: AffiliateSurface,
): ResolveAffiliateResult => ({
  affiliateId: override.affiliateId,
  affiliateName: override.name,
  network: override.network,
  surface,
  status: override.isPaused ? "paused" : "resolved",
  adminOverride: override,
});

export function resolveAffiliate({
  brand,
  surface,
  adminOverrides,
}: ResolveAffiliateOptions): ResolveAffiliateResult {
  const normalizedBrand = normalizeBrand(brand);

  const entries = normalizedBrand
    ? findCanonEntriesByBrand(normalizedBrand).filter(
        (entry) => entry.allowedSurfaces[surface],
      )
    : [];

  const sortedEntries = [...entries].sort(
    (a, b) => priorityOrder[a.priorityTier] - priorityOrder[b.priorityTier],
  );

  const direct = sortedEntries.find((entry) => entry.network === "DIRECT");
  if (direct) {
    return createCanonicalResolution(direct, surface);
  }

  const adminCandidate = adminOverrides?.find((override) => {
    const allowsSurface =
      !override.allowedSurfaces || override.allowedSurfaces.includes(surface);
    return (
      allowsSurface &&
      (override.network === "CJ" || override.network === "IMPACT")
    );
  });

  if (adminCandidate) {
    return createAdminResolution(adminCandidate, surface);
  }

  const awin = sortedEntries.find((entry) => entry.network === "AWIN");
  if (awin) {
    return createCanonicalResolution(awin, surface);
  }

  if (MYREGISTRY_CANON.allowedSurfaces[surface]) {
    return createCanonicalResolution(MYREGISTRY_CANON, surface);
  }

  return {
    affiliateId: normalizedBrand || "tmbc-default",
    affiliateName: brand ?? "Taylor-Made Baby Co.",
    network: "UNKNOWN",
    surface,
    status: "missing",
  };
}

export function mapPartnerToOverride(
  partner: AffiliatePartner,
  surfaces: AffiliateSurface[],
): AdminAffiliateOverride {
  return {
    affiliateId: partner.id,
    name: partner.name,
    network: partner.network as AffiliateNetwork,
    allowedSurfaces: surfaces,
    isPaused: false,
  };
}

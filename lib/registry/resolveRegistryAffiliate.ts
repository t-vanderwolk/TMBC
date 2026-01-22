import type { AffiliatePartner, PrismaClient } from "@prisma/client";

import { resolveAffiliatePartner } from "@/lib/affiliates/resolveAffiliate";
import {
  mapPartnerToOverride,
  resolveAffiliate,
  ResolveAffiliateResult,
} from "@/lib/affiliate/affiliate.service";

export type RegistryRoutingMode = "AFFILIATE" | "EDUCATION_ONLY";

export type RegistryAffiliateResolution = {
  affiliatePartner: AffiliatePartner | null;
  routingMode: RegistryRoutingMode;
  canonicalResolution?: ResolveAffiliateResult;
};

export async function resolveRegistryAffiliate({
  prisma,
  brandName,
}: {
  prisma: PrismaClient;
  brandName?: string | null;
}): Promise<RegistryAffiliateResolution> {
  const partner = await resolveAffiliatePartner({ prisma, brandName });
  const resolution = resolveAffiliate({
    brand: brandName,
    surface: "registry",
    adminOverrides: partner
      ? [mapPartnerToOverride(partner, ["registry"])]
      : undefined,
  });
  return {
    affiliatePartner: partner,
    routingMode: partner ? "AFFILIATE" : "EDUCATION_ONLY",
    canonicalResolution: resolution,
  };
}

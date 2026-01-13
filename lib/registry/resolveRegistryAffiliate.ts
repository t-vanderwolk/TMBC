import type { AffiliatePartner, PrismaClient } from "@prisma/client";

import { resolveAffiliatePartner } from "@/lib/affiliates/resolveAffiliate";

export type RegistryRoutingMode = "AFFILIATE" | "EDUCATION_ONLY";

export type RegistryAffiliateResolution = {
  affiliatePartner: AffiliatePartner | null;
  routingMode: RegistryRoutingMode;
};

export async function resolveRegistryAffiliate({
  prisma,
  brandName,
}: {
  prisma: PrismaClient;
  brandName?: string | null;
}): Promise<RegistryAffiliateResolution> {
  const partner = await resolveAffiliatePartner({ prisma, brandName });
  return partner
    ? { affiliatePartner: partner, routingMode: "AFFILIATE" }
    : { affiliatePartner: null, routingMode: "EDUCATION_ONLY" };
}

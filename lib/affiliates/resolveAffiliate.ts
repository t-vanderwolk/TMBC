import type { AffiliatePartner, PrismaClient } from "@prisma/client";

import { AFFILIATE_FALLBACK_RETAILERS } from "./fallbackRetailers";

type ResolveAffiliateParams = {
  prisma: PrismaClient;
  brandName?: string | null;
};

export async function resolveAffiliatePartner({
  prisma,
  brandName,
}: ResolveAffiliateParams): Promise<AffiliatePartner | null> {
  const normalizedBrand = brandName?.trim();
  if (!normalizedBrand) {
    return null;
  }

  const direct = await prisma.affiliatePartner.findFirst({
    where: {
      name: { equals: normalizedBrand, mode: "insensitive" },
    },
  });

  if (direct) {
    return direct;
  }

  if (!AFFILIATE_FALLBACK_RETAILERS.length) {
    return null;
  }

  const fallbacks = await prisma.affiliatePartner.findMany({
    where: {
      name: { in: AFFILIATE_FALLBACK_RETAILERS },
    },
  });

  for (const fallbackName of AFFILIATE_FALLBACK_RETAILERS) {
    const match = fallbacks.find((partner) => partner.name === fallbackName);
    if (match) {
      return match;
    }
  }

  return null;
}

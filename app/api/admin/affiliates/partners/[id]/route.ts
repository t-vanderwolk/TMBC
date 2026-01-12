import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  getAdminAffiliatePartnerById,
  updateAdminAffiliatePartner,
} from "@/lib/services/server/affiliateAdmin.service";
import type {
  AffiliateNetwork,
  AffiliatePartnerRole,
  AffiliatePartnerStatus,
  AffiliateVisibility,
  AffiliateBlogSettings,
  AffiliateRegistrySettings,
} from "@/types/adminAffiliates";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

const requireAdmin = async (request?: Request) => {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
};

const isNetwork = (value: unknown): value is AffiliateNetwork =>
  typeof value === "string" &&
  ["CJ", "IMPACT", "AWIN", "SHAREASALE", "MYREGISTRY", "DIRECT"].includes(value);

const isStatus = (value: unknown): value is AffiliatePartnerStatus =>
  value === "ACTIVE" || value === "PAUSED" || value === "AT_RISK";

const isRole = (value: unknown): value is AffiliatePartnerRole =>
  value === "Brand" || value === "Retailer" || value === "Infrastructure";

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin(_request);
    const partner = await getAdminAffiliatePartnerById(context.params.id);
    if (!partner) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ data: partner });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load partner.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request);
    const body = await request.json().catch(() => ({}));

    const payload: {
      name?: string;
      network?: AffiliateNetwork;
      defaultLink?: string | null;
      cookieWindow?: number | null;
      commissionRate?: string | null;
      status?: AffiliatePartnerStatus;
      category?: string | null;
      role?: AffiliatePartnerRole;
      visibility?: Partial<AffiliateVisibility>;
      blogSettings?: Partial<AffiliateBlogSettings>;
      registrySettings?: Partial<AffiliateRegistrySettings>;
      affiliateIds?: Partial<Record<AffiliateNetwork, string>>;
      internalNotes?: string | null;
    } = {};

    if (typeof body.name === "string") {
      payload.name = body.name.trim();
    }
    if (isNetwork(body.network)) {
      payload.network = body.network;
    }
    if (typeof body.defaultLink === "string") {
      payload.defaultLink = body.defaultLink.trim();
    }
    if (body.defaultLink === null) {
      payload.defaultLink = null;
    }
    if (typeof body.cookieWindow === "number") {
      payload.cookieWindow = body.cookieWindow;
    }
    if (typeof body.commissionRate === "string") {
      payload.commissionRate = body.commissionRate.trim();
    }
    if (isStatus(body.status)) {
      payload.status = body.status;
    }
    if (typeof body.category === "string") {
      payload.category = body.category.trim();
    }
    if (body.category === null) {
      payload.category = null;
    }
    if (isRole(body.role)) {
      payload.role = body.role;
    }
    if (typeof body.internalNotes === "string") {
      payload.internalNotes = body.internalNotes.trim();
    }
    if (body.internalNotes === null) {
      payload.internalNotes = null;
    }

    if (typeof body.visibility === "object" && body.visibility !== null) {
      payload.visibility = {
        blogEligible: typeof (body.visibility as any).blogEligible === "boolean"
          ? (body.visibility as any).blogEligible
          : undefined,
        registryEligible: typeof (body.visibility as any).registryEligible === "boolean"
          ? (body.visibility as any).registryEligible
          : undefined,
        mentorVisible: typeof (body.visibility as any).mentorVisible === "boolean"
          ? (body.visibility as any).mentorVisible
          : undefined,
      };
    }

    if (typeof body.blogSettings === "object" && body.blogSettings !== null) {
      const blogSettings: Partial<AffiliateBlogSettings> = {};
      if (typeof (body.blogSettings as any).eligible === "boolean") {
        blogSettings.eligible = (body.blogSettings as any).eligible;
      }
      if (
        typeof (body.blogSettings as any).defaultCta === "string" &&
        ["Shop", "Explore", "Learn More"].includes((body.blogSettings as any).defaultCta)
      ) {
        blogSettings.defaultCta = (body.blogSettings as any).defaultCta as AffiliateBlogSettings["defaultCta"];
      }
      if (typeof (body.blogSettings as any).primaryEligible === "boolean") {
        blogSettings.primaryEligible = (body.blogSettings as any).primaryEligible;
      }
      if (Object.keys(blogSettings).length) {
        payload.blogSettings = blogSettings;
      }
    }

    if (typeof body.registrySettings === "object" && body.registrySettings !== null) {
      const exclusions = Array.isArray((body.registrySettings as any).categoryExclusions)
        ? ((body.registrySettings as any).categoryExclusions as string[])
            .map((value) => value.trim())
            .filter(Boolean)
        : [];
      const registrySettings: Partial<AffiliateRegistrySettings> = {
        categoryExclusions: exclusions,
      };
      if (
        typeof (body.registrySettings as any).retailerTier === "string" &&
        ["Tier-1", "Tier-2"].includes((body.registrySettings as any).retailerTier)
      ) {
        registrySettings.retailerTier = (body.registrySettings as any)
          .retailerTier as AffiliateRegistrySettings["retailerTier"];
      }
      if (typeof (body.registrySettings as any).priority === "number") {
        registrySettings.priority = (body.registrySettings as any).priority;
      }
      if (typeof (body.registrySettings as any).fallbackToBrandDirect === "boolean") {
        registrySettings.fallbackToBrandDirect = (body.registrySettings as any).fallbackToBrandDirect;
      }
      if (Object.keys(registrySettings).length) {
        payload.registrySettings = registrySettings;
      }
    }

    if (typeof body.affiliateIds === "object" && body.affiliateIds !== null) {
      const participantIds: Partial<Record<AffiliateNetwork, string>> = {};
      for (const candidate of ["CJ", "IMPACT", "AWIN", "SHAREASALE", "MYREGISTRY", "DIRECT"] as AffiliateNetwork[]) {
        const raw = (body.affiliateIds as Record<string, unknown>)[candidate];
        if (typeof raw === "string" && raw.trim()) {
          participantIds[candidate] = raw.trim();
        }
      }
      if (Object.keys(participantIds).length) {
        payload.affiliateIds = participantIds;
      }
    }

    const updated = await updateAdminAffiliatePartner(context.params.id, payload);
    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update affiliate partner.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import {
  createAdminBlogAffiliateLink,
  listAdminBlogAffiliateLinks,
} from "@/lib/services/server/affiliateAdmin.service";
import type { AffiliateNetwork, AffiliatePosition } from "@/types/adminAffiliates";

export const dynamic = "force-dynamic";

const NETWORKS: AffiliateNetwork[] = [
  "CJ",
  "IMPACT",
  "AWIN",
  "SHAREASALE",
  "MYREGISTRY",
  "DIRECT",
];

const POSITIONS: AffiliatePosition[] = ["INLINE", "CALLOUT", "END_CARD"];

export async function GET(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const payload = await listAdminBlogAffiliateLinks();
    return NextResponse.json({ data: payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load blog links.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const partnerName = typeof body.partnerName === "string" ? body.partnerName.trim() : "";
    const label = typeof body.label === "string" ? body.label.trim() : "";
    const position = typeof body.position === "string" ? body.position : "";
    const network = typeof body.network === "string" ? body.network : "";
    const destinationUrl = typeof body.destinationUrl === "string" ? body.destinationUrl.trim() : "";
    const blogPostId = typeof body.blogPostId === "string" ? body.blogPostId : "";
    const isPrimary = Boolean(body.isPrimary);

    if (!blogPostId || !partnerName || !label || !destinationUrl) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!NETWORKS.includes(network as AffiliateNetwork) || !POSITIONS.includes(position as AffiliatePosition)) {
      return NextResponse.json({ error: "Invalid network or position." }, { status: 400 });
    }

    await createAdminBlogAffiliateLink({
      blogPostId,
      partnerName,
      network: network as AffiliateNetwork,
      label,
      position: position as AffiliatePosition,
      destinationUrl,
      isPrimary,
    });

    const payload = await listAdminBlogAffiliateLinks();
    return NextResponse.json({ data: payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create affiliate link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

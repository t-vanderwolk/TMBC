import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { updateAdminBlogAffiliateLink, listAdminBlogAffiliateLinks } from "@/lib/services/server/affiliateAdmin.service";
import type { AffiliatePartnerStatus, AffiliatePosition } from "@/types/adminAffiliates";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (typeof body.destinationUrl === "string") {
      updates.destinationUrl = body.destinationUrl.trim();
    }
    if (typeof body.label === "string") {
      updates.label = body.label.trim();
    }
    if (typeof body.position === "string" && body.position !== "") {
      updates.position = body.position;
    }
    if (body.isPrimary !== undefined) {
      updates.isPrimary = Boolean(body.isPrimary);
    }
    if (body.status === "ACTIVE" || body.status === "PAUSED") {
      updates.status = body.status;
    }

    await updateAdminBlogAffiliateLink(context.params.id, updates as {
      destinationUrl?: string;
      isPrimary?: boolean;
      status?: AffiliatePartnerStatus;
      label?: string;
      position?: AffiliatePosition;
    });

    const payload = await listAdminBlogAffiliateLinks();
    return NextResponse.json({ data: payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update affiliate link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

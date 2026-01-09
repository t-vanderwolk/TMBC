import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { updateAdminAffiliatePartner, listAdminAffiliatePartners } from "@/lib/services/server/affiliateAdmin.service";
import type { AffiliatePartnerStatus } from "@/types/adminAffiliates";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const user = await getUserOrThrow(_request);
    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await _request.json().catch(() => ({}));
    const payload: { status?: AffiliatePartnerStatus; note?: string | null } = {};
    if (body.status === "ACTIVE" || body.status === "PAUSED") {
      payload.status = body.status;
    }

    if (typeof body.note === "string") {
      payload.note = body.note.trim();
    }
    if (body.note === null) {
      payload.note = null;
    }

    await updateAdminAffiliatePartner(context.params.id, payload);

    const partners = await listAdminAffiliatePartners();
    return NextResponse.json({ data: partners });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update partner.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

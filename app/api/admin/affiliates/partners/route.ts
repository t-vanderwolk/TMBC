import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { listAdminAffiliatePartners } from "@/lib/services/server/affiliateAdmin.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const partners = await listAdminAffiliatePartners();
    return NextResponse.json({ data: partners });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load affiliate partners.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

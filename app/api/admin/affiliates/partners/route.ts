import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { listAdminAffiliatePartners } from "@/lib/services/server/affiliateAdmin.service";

export const dynamic = "force-dynamic";

const requireAdmin = async (request?: Request) => {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
};

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const partners = await listAdminAffiliatePartners();
    return NextResponse.json({ data: partners });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load affiliate partners.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { refreshPriceWatchesForUser } from "@/lib/services/server/priceIntelligence.service";

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to refresh price intelligence.";
  return NextResponse.json({ error: message }, { status: 400 });
};

export async function POST(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== "MEMBER") {
      return NextResponse.json({ error: "Only members can refresh price insights." }, { status: 403 });
    }
    const alerts = await refreshPriceWatchesForUser(user.id);
    return NextResponse.json({ alerts });
  } catch (error) {
    return handleError(error);
  }
}

import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { getAdminAnalytics } from "@/lib/services/server/adminAnalytics.service";

export async function GET(request: Request) {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const rangeParam = url.searchParams.get("rangeDays");
    const rangeDays = rangeParam ? Number(rangeParam) : undefined;

    const payload = await getAdminAnalytics({ rangeDays });
    return NextResponse.json({ data: payload });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to load admin analytics" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 },
    );
  }
}

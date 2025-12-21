import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { getStoredPinterestToken } from "@/lib/services/server/pinterest.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const token = await getStoredPinterestToken(user.id);
    return NextResponse.json({ connected: Boolean(token?.accessToken) });
  } catch (error) {
    console.error("Pinterest status check failed", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ connected: false }, { status: 401 });
    }
    return NextResponse.json(
      { connected: false, error: "Unable to determine Pinterest connection" },
      { status: 500 },
    );
  }
}

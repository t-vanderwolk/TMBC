import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { getPinterestAuthUrl } from "@/lib/services/server/pinterest.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    const authUrl = getPinterestAuthUrl(user.id);
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Pinterest auth request failed", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Unable to start Pinterest auth" },
      { status: 500 },
    );
  }
}

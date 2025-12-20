import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { approveInviteRequest } from "@/lib/services/server/inviteRequest.service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  let user;
  try {
    user = await getUserOrThrow();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const requestId = params?.id;
  if (!requestId) {
    return NextResponse.json({ error: "Request id is required" }, { status: 400 });
  }

  try {
    const result = await approveInviteRequest(requestId, user.id);
    return NextResponse.json({
      data: result.request,
      inviteCode: result.inviteCode,
      emailSent: result.emailSent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to approve invite request" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { listInviteRequests } from "@/lib/services/server/inviteRequest.service";

export async function GET() {
  let user;
  try {
    user = await getUserOrThrow();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const requests = await listInviteRequests();
  return NextResponse.json({ data: requests });
}

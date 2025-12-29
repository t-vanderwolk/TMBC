import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { sendInviteEmail } from "@/lib/email/sendInviteEmail";
import { prisma } from "@/lib/prisma";
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

  let approvalResult: { request: { email: string }; inviteCode: string } | null = null;

  try {
    approvalResult = await approveInviteRequest(requestId, user.id);

    // Approval must include a successful invite email send; otherwise we roll back the approval.
    await sendInviteEmail({
      email: approvalResult.request.email,
      inviteCode: approvalResult.inviteCode,
    });

    return NextResponse.json({
      data: approvalResult.request,
      inviteCode: approvalResult.inviteCode,
      emailSent: true,
    });
  } catch (error) {
    const message = (error as Error).message ?? "Unable to approve invite request";
    const status = message === "Invite request already approved" ? 409 : 500;

    if (status === 500 && approvalResult) {
      try {
        await prisma.inviteRequest.update({
          where: { id: requestId },
          data: {
            status: "pending",
            inviteCode: null,
            approvedById: null,
          },
        });
        await prisma.inviteCode.deleteMany({
          where: { code: approvalResult.inviteCode },
        });
      } catch (rollbackError) {
        console.error("Failed to roll back invite approval after email failure", rollbackError);
      }
    }

    return NextResponse.json({ error: message }, { status });
  }
}

import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/utils/server/inviteCode";
import { sendInviteEmail } from "@/lib/services/server/email.service";

export type InviteRequestRow = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  message?: string | null;
  status: string;
  inviteCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
  approvedById?: string | null;
};

export const listInviteRequests = async (): Promise<InviteRequestRow[]> => {
  return prisma.inviteRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      message: true,
      status: true,
      inviteCode: true,
      createdAt: true,
      updatedAt: true,
      approvedById: true,
    },
  });
};

export const approveInviteRequest = async (id: string, approverId: string) => {
  const existing = await prisma.inviteRequest.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Invite request not found");
  }

  if (existing.status === "approved" && existing.inviteCode) {
    return {
      request: existing,
      inviteCode: existing.inviteCode,
      emailSent: false,
    };
  }

  const inviteCodeValue = generateInviteCode();

  const [inviteCodeRow, updatedRequest] = await prisma.$transaction([
    prisma.inviteCode.create({
      data: {
        code: inviteCodeValue,
        email: existing.email,
      },
    }),
    prisma.inviteRequest.update({
      where: { id },
      data: {
        status: "approved",
        inviteCode: inviteCodeValue,
        approvedById: approverId,
      },
    }),
  ]);

  let emailSent = false;
  try {
    await sendInviteEmail({
      to: existing.email,
      code: inviteCodeRow.code,
    });
    emailSent = true;
  } catch (error) {
    console.error("Failed to send invite email", error);
  }

  return {
    request: updatedRequest,
    inviteCode: inviteCodeRow.code,
    emailSent,
  };
};

export const rejectInviteRequest = async (id: string) => {
  const existing = await prisma.inviteRequest.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Invite request not found");
  }

  if (existing.status === "rejected") {
    return existing;
  }

  return prisma.inviteRequest.update({
    where: { id },
    data: {
      status: "rejected",
    },
  });
};

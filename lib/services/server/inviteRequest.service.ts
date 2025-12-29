import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/utils/server/inviteCode";

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

  if (existing.status === "approved") {
    throw new Error("Invite request already approved");
  }

  const isUniqueConstraintError = (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

  let inviteCodeRow;
  let updatedRequest;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const inviteCodeValue = generateInviteCode();

    try {
      [inviteCodeRow, updatedRequest] = await prisma.$transaction([
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
      break;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        continue;
      }
      throw error;
    }
  }

  if (!inviteCodeRow || !updatedRequest) {
    throw new Error("Unable to generate a unique invite code");
  }

  return {
    request: updatedRequest,
    inviteCode: inviteCodeRow.code,
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

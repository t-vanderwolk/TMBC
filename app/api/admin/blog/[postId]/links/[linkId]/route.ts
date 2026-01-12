import { AffiliateNetwork, AffiliatePosition, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import {
  deleteAdminBlogAffiliateLink,
  listAffiliateLinksForPost,
  updateAdminBlogAffiliateLink,
} from "@/lib/services/server/affiliateAdmin.service";

const requireAdmin = async () => {
  const user = await getUserOrThrow();
  if (user.role !== Role.ADMIN) {
    throw new Error("Only admins can manage affiliate links.");
  }
  return user;
};

const networkMap: Record<string, AffiliateNetwork> = {
  CJ: "CJ",
  IMPACT: "IMPACT",
  AWIN: "AWIN",
  SHAREASALE: "SHAREASALE",
  MYREGISTRY: "MYREGISTRY",
  DIRECT: "DIRECT",
  AMAZON: "DIRECT",
};

const positionEnum = z.enum(["INLINE", "CALLOUT", "END_CARD"]);
const patchSchema = z.object({
  partnerName: z.string().trim().min(1).optional(),
  label: z.string().trim().min(1).optional(),
  position: positionEnum.optional(),
  destinationUrl: z.string().url().optional(),
  status: z.enum(["ACTIVE", "PAUSED"]).optional(),
  network: z.string().trim().min(1).optional(),
});

type RouteContext = {
  params: {
    postId: string;
    linkId: string;
  };
};

const resolveNetwork = (value: string): AffiliateNetwork => {
  const key = value.trim().toUpperCase();
  const resolved = networkMap[key];
  if (!resolved) {
    throw new Error("Invalid affiliate network.");
  }
  return resolved;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const link = await prisma.blogAffiliateLink.findUnique({ where: { id: context.params.linkId } });
    if (!link || link.blogPostId !== context.params.postId) {
      return NextResponse.json({ error: "Affiliate link not found." }, { status: 404 });
    }

    const payload = patchSchema.parse(await request.json());
    const updates: Record<string, unknown> = {};
    if (payload.destinationUrl) {
      updates.destinationUrl = payload.destinationUrl;
    }
    if (payload.label) {
      updates.label = payload.label;
    }
    if (payload.position) {
      updates.position = payload.position;
    }
    if (payload.partnerName) {
      updates.partnerName = payload.partnerName;
    }
    if (payload.network) {
      updates.network = resolveNetwork(payload.network);
    }
    if (typeof payload.isPrimary === "boolean") {
      updates.isPrimary = payload.isPrimary;
    }
    if (payload.status) {
      updates.status = payload.status;
    }

    await updateAdminBlogAffiliateLink(context.params.linkId, updates as {
      destinationUrl?: string;
      isPrimary?: boolean;
      status?: "ACTIVE" | "PAUSED";
      label?: string;
      position?: AffiliatePosition;
      partnerName?: string;
      network?: AffiliateNetwork;
    });

    const links = await listAffiliateLinksForPost(context.params.postId);
    return NextResponse.json({ data: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update affiliate link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const link = await prisma.blogAffiliateLink.findUnique({ where: { id: context.params.linkId } });
    if (!link || link.blogPostId !== context.params.postId) {
      return NextResponse.json({ error: "Affiliate link not found." }, { status: 404 });
    }

    await deleteAdminBlogAffiliateLink(context.params.linkId);
    const links = await listAffiliateLinksForPost(context.params.postId);
    return NextResponse.json({ data: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete affiliate link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

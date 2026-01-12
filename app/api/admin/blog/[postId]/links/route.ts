import { AffiliateNetwork, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import {
  createAdminBlogAffiliateLink,
  listAffiliateLinksForPost,
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
const linkSchema = z.object({
  partnerName: z.string().trim().min(1),
  label: z.string().trim().min(1),
  position: positionEnum,
  network: z.string().trim().min(1),
  destinationUrl: z.string().url(),
});

type RouteContext = {
  params: { postId: string };
};

const resolveNetwork = (value: string): AffiliateNetwork => {
  const key = value.trim().toUpperCase();
  const resolved = networkMap[key];
  if (!resolved) {
    throw new Error("Invalid affiliate network.");
  }
  return resolved;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    const links = await listAffiliateLinksForPost(post.id);
    return NextResponse.json({ data: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load affiliate links.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    const payload = linkSchema.parse(await request.json());
    const network = resolveNetwork(payload.network);

    await createAdminBlogAffiliateLink({
      blogPostId: post.id,
      partnerName: payload.partnerName,
      label: payload.label,
      position: payload.position,
      network,
      destinationUrl: payload.destinationUrl,
      isPrimary: payload.isPrimary ?? false,
    });

    const links = await listAffiliateLinksForPost(post.id);
    return NextResponse.json({ data: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create affiliate link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

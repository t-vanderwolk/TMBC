import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import {
  upsertBlogHighlights,
  validateBlogPayload,
  ensureUniqueBlogSlug,
} from "@/lib/services/server/blog.service";
import {
  listAffiliateLinksForPost,
} from "@/lib/services/server/affiliateAdmin.service";

type RouteContext = {
  params: { postId: string };
};

const requireAdmin = async (request?: Request) => {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.ADMIN) {
    throw new Error("Only admins can manage blog posts.");
  }
  return user;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request);
    const post = await prisma.blogPost.findUnique({
      where: { id: context.params.postId },
      include: {
        highlights: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            brandName: true,
            note: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const affiliateLinks = await listAffiliateLinksForPost(post.id);
    return NextResponse.json({ data: { ...post, affiliateLinks } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load blog post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request);
    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const payload = await request.json();
    const validated = await validateBlogPayload(payload);
    const slug = await ensureUniqueBlogSlug(validated.slug, post.id);

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        slug,
        title: validated.title,
        excerpt: validated.excerpt,
        heroImage: validated.heroImage,
        content: validated.content,
        tags: validated.tags,
        isAffiliate: validated.isAffiliate,
      },
    });

    await upsertBlogHighlights(updated.id, validated.highlights);

    const affiliateLinks = await listAffiliateLinksForPost(updated.id);
    const refreshed = await prisma.blogPost.findUnique({
      where: { id: updated.id },
      include: {
        highlights: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            brandName: true,
            note: true,
          },
        },
      },
    });
    if (!refreshed) {
      return NextResponse.json({ error: "Unable to refresh blog post." }, { status: 500 });
    }

    return NextResponse.json({ data: { ...refreshed, affiliateLinks } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update blog post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

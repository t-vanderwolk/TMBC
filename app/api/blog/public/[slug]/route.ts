import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { handleMissingBlogTable, isBlogFeatureEnabled } from "@/lib/blog/blogReadiness";
import { blogAffiliatePolicy } from "@/lib/blog/affiliatePolicy";
import { prisma } from "@/lib/prisma";
import { BLOG_SESSION_COOKIE } from "@/lib/constants/blogAnalytics";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { slug: string };
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = context.params;
  const url = new URL(request.url);
  const sourceContext = url.searchParams.get("sourceContext") ?? null;
  const sessionId = cookies().get(BLOG_SESSION_COOKIE)?.value ?? null;

  if (!isBlogFeatureEnabled()) {
    return NextResponse.json(
      { error: "Blog temporarily unavailable.", unavailable: true },
      { status: 503 },
    );
  }

  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        publishedAt: { not: null },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        heroImage: true,
        publishedAt: true,
        authorName: true,
        authorRoleSnapshot: true,
        tags: true,
        highlights: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            brandName: true,
            note: true,
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                category: true,
                imageUrl: true,
              },
            },
          },
        },
        affiliateLinks: {
          orderBy: { isPrimary: "desc" },
          select: {
            id: true,
            partnerName: true,
            label: true,
            position: true,
            isPrimary: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const affiliateLinks = post.affiliateLinks
      .map((link) => ({
        ...link,
        policy: blogAffiliatePolicy(link.partnerName),
      }))
      .filter((link) => link.policy.allowed);

    void prisma.blogEngagementEvent
      .create({
        data: {
          blogPostId: post.id,
          event: "VIEW",
          sourceContext: sourceContext ?? undefined,
          sessionId: sessionId ?? undefined,
        },
      })
      .catch((error) => {
        console.warn("[blog engagement] failed to track view", error);
      });

    return NextResponse.json({ ...post, affiliateLinks });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog temporarily unavailable.", unavailable: true },
        { status: 503 },
      );
    }
    throw error;
  }
}

import { NextResponse } from "next/server";

import { handleMissingBlogTable, isBlogFeatureEnabled } from "@/lib/blog/blogReadiness";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isBlogFeatureEnabled()) {
    return NextResponse.json({ posts: [], unavailable: true });
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
      },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        heroImage: true,
        publishedAt: true,
        authorName: true,
        authorRoleSnapshot: true,
        tags: true,
      },
    });

    return NextResponse.json({ posts, unavailable: false });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json({ posts: [], unavailable: true });
    }
    throw error;
  }
}

import { NextResponse } from "next/server";

import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
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

    return NextResponse.json(posts);
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json([], { status: 200 });
    }
    throw error;
  }
}

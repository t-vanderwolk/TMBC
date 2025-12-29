import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
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
}

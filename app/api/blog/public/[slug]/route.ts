import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { slug: string };
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = context.params;

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
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

  void prisma.blogEngagementEvent
    .create({
      data: {
        blogPostId: post.id,
        event: "VIEW",
      },
    })
    .catch((error) => {
      console.warn("[blog engagement] failed to track view", error);
    });

  return NextResponse.json(post);
}

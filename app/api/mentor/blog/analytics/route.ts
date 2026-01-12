import { BlogEngagementType, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  postId: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.MENTOR && user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Only mentors can access this analytics view." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const { postId } = querySchema.parse({
      postId: searchParams.get("postId") ?? "",
    });

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });
    if (!post || (user.role === Role.MENTOR && post.authorId !== user.id)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const engagementCounts = await prisma.blogEngagementEvent.groupBy({
      by: ["event"],
      where: { blogPostId: postId },
      _count: { id: true },
    });

    const metrics: Record<BlogEngagementType, number> = {
      VIEW: 0,
      READ_75: 0,
      SHARE: 0,
    };
    engagementCounts.forEach((row) => {
      metrics[row.event] = row._count.id;
    });

    const clicks = await prisma.blogAffiliateEvent.count({
      where: { blogPostId: postId, event: "CLICK" },
    });

    return NextResponse.json({
      data: {
        postId,
        metrics: {
          views: metrics.VIEW,
          read75: metrics.READ_75,
          shares: metrics.SHARE,
          clicks,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load analytics.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

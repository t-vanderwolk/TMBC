import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";

const querySchema = z.object({
  postId: z.string().min(1).optional(),
});

export async function GET(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Only admins can access blog analytics." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const { postId } = querySchema.parse({
      postId: searchParams.get("postId") ?? undefined,
    });

    const where = postId ? { id: postId } : {};
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        authorName: true,
        status: true,
      },
    });

    if (postId && posts.length === 0) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    if (!posts.length) {
      return NextResponse.json({
        data: {
          posts: [],
          totals: { views: 0, read75: 0, shares: 0, clicks: 0 },
        },
      });
    }

    const postIds = posts.map((post) => post.id);

    const engagements = await prisma.blogEngagementEvent.groupBy({
      by: ["blogPostId", "event"],
      where: { blogPostId: { in: postIds } },
      _count: { id: true },
    });

    const metricsMap = new Map<
      string,
      { views: number; read75: number; shares: number; clicks: number }
    >();
    posts.forEach((post) => {
      metricsMap.set(post.id, { views: 0, read75: 0, shares: 0, clicks: 0 });
    });

    engagements.forEach((entry) => {
      const record = metricsMap.get(entry.blogPostId);
      if (!record) return;
      if (entry.event === "VIEW") {
        record.views = entry._count.id;
      } else if (entry.event === "READ_75") {
        record.read75 = entry._count.id;
      } else if (entry.event === "SHARE") {
        record.shares = entry._count.id;
      }
    });

    const affiliateEvents = await prisma.blogAffiliateEvent.findMany({
      where: { blogPostId: { in: postIds }, event: "CLICK" },
      include: {
        affiliateLink: {
          select: {
            id: true,
            partnerName: true,
            network: true,
            label: true,
          },
        },
      },
    });

    const affiliateBreakdown = new Map<string, Map<string, { linkId: string; partnerName: string | null; network: string; label: string | null; clicks: number }>>();

    affiliateEvents.forEach((event) => {
      const metrics = metricsMap.get(event.blogPostId);
      if (metrics) {
        metrics.clicks += 1;
      }

      const link = event.affiliateLink;
      if (!link) return;

      const breakdown = affiliateBreakdown.get(event.blogPostId) ?? new Map();
      const existing = breakdown.get(link.id);
      if (existing) {
        existing.clicks += 1;
        breakdown.set(link.id, existing);
      } else {
        breakdown.set(link.id, {
          linkId: link.id,
          partnerName: link.partnerName ?? null,
          network: link.network,
          label: link.label ?? null,
          clicks: 1,
        });
      }
      affiliateBreakdown.set(event.blogPostId, breakdown);
    });

    const payload = posts.map((post) => {
      const metrics = metricsMap.get(post.id) ?? { views: 0, read75: 0, shares: 0, clicks: 0 };
      const linkBreakdown = affiliateBreakdown.get(post.id);
      return {
        ...post,
        metrics,
        affiliateClicks: linkBreakdown ? Array.from(linkBreakdown.values()) : [],
      };
    });

    const totals = payload.reduce(
      (acc, row) => {
        acc.views += row.metrics.views;
        acc.read75 += row.metrics.read75;
        acc.shares += row.metrics.shares;
        acc.clicks += row.metrics.clicks;
        return acc;
      },
      { views: 0, read75: 0, shares: 0, clicks: 0 },
    );

    return NextResponse.json({ data: { posts: payload, totals } });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog analytics are temporarily unavailable." },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to load analytics.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

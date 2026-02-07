import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import {
  BLOG_IMPACT_SLUG,
  BLOG_SESSION_COOKIE,
  TIME_ON_PAGE_BUCKETS,
} from "@/lib/constants/blogAnalytics";
import type { Prisma, BlogEngagementType } from "@prisma/client";

const eventSchema = z.object({
  slug: z.string().min(1),
  event: z.enum(["blog_view", "blog_scroll_depth", "time_on_page"]),
  sessionId: z.string().min(1).optional(),
  sourceContext: z.string().min(1).optional(),
  depth: z.number().min(0).max(100).optional(),
  bucket: z.enum(TIME_ON_PAGE_BUCKETS).optional(),
});

type BlogAnalyticsPayload = ReturnType<typeof eventSchema["parse"]>;

const EVENT_MAP: Record<BlogAnalyticsPayload["event"], BlogEngagementType> = {
  blog_view: "BLOG_VIEW",
  blog_scroll_depth: "BLOG_SCROLL_DEPTH",
  time_on_page: "TIME_ON_PAGE",
};

export async function POST(request: Request) {
  let payload: BlogAnalyticsPayload;
  try {
    payload = eventSchema.parse(await request.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid analytics payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (payload.slug !== BLOG_IMPACT_SLUG) {
    return NextResponse.json({ error: "Content not tracked." }, { status: 400 });
  }

  if (payload.event === "blog_scroll_depth" && typeof payload.depth !== "number") {
    return NextResponse.json({ error: "Scroll depth is required." }, { status: 400 });
  }

  if (payload.event === "time_on_page" && !payload.bucket) {
    return NextResponse.json({ error: "Time bucket is required." }, { status: 400 });
  }

  const sessionId = payload.sessionId ?? cookies().get(BLOG_SESSION_COOKIE)?.value ?? null;

  let userId: string | null = null;
  try {
    const user = await getUserOrThrow(request);
    userId = user.id;
  } catch {
    userId = null;
  }

  const post = await prisma.blogPost.findUnique({
    where: { slug: payload.slug },
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  const metadata: Record<string, unknown> = {};
  if (payload.depth !== undefined) {
    metadata.depth = payload.depth;
  }
  if (payload.bucket) {
    metadata.bucket = payload.bucket;
  }

  const eventType = EVENT_MAP[payload.event];
  if (!eventType) {
    return NextResponse.json({ error: "Unsupported event." }, { status: 400 });
  }

  await prisma.blogEngagementEvent.create({
    data: {
      blogPostId: post.id,
      event: eventType,
      viewerId: userId ?? undefined,
      sessionId: sessionId ?? undefined,
      sourceContext: payload.sourceContext ?? undefined,
      scrollDepth: payload.event === "blog_scroll_depth" ? payload.depth : undefined,
      timeOnPageBucket: payload.event === "time_on_page" ? payload.bucket : undefined,
      metadata: Object.keys(metadata).length ? (metadata as Prisma.JsonObject) : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}

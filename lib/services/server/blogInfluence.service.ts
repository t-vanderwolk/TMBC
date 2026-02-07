import { Prisma, BlogEngagementType, BlogInfluenceActionType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { BLOG_IMPACT_SLUG } from "@/lib/constants/blogAnalytics";

const INFLUENCE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BLOG_VIEW_EVENTS: BlogEngagementType[] = ["VIEW", "BLOG_VIEW"];

export type BlogInfluenceActionPayload = {
  slug: string;
  action: BlogInfluenceActionType;
  referenceId?: string | null;
  registryItemId?: string | null;
  sessionId?: string | null;
  userId?: string | null;
};

const findBlogPostId = async (slug: string) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { id: true },
  });
  return post?.id ?? null;
};

const hasRecentBlogView = async (blogPostId: string, sessionId?: string | null, userId?: string | null) => {
  if (!sessionId && !userId) {
    return false;
  }

  const conditions: Prisma.BlogEngagementEventWhereInput[] = [];
  if (sessionId) {
    conditions.push({ sessionId });
  }
  if (userId) {
    conditions.push({ viewerId: userId });
  }

  if (!conditions.length) {
    return false;
  }

  const cutoff = new Date(Date.now() - INFLUENCE_WINDOW_MS);
  const count = await prisma.blogEngagementEvent.count({
    where: {
      blogPostId,
      event: { in: BLOG_VIEW_EVENTS },
      createdAt: { gte: cutoff },
      OR: conditions,
    },
  });

  return count > 0;
};

const ensureRegistryItemInfluence = async (registryItemId: string, slug: string) => {
  const exists = await prisma.registryItemBlogInfluence.findFirst({
    where: { registryItemId, postSlug: slug },
    select: { id: true },
  });
  if (exists) {
    return;
  }
  await prisma.registryItemBlogInfluence.create({
    data: {
      registryItemId,
      postSlug: slug,
    },
  });
};

export const recordBlogInfluenceAction = async (payload: BlogInfluenceActionPayload) => {
  if (payload.slug !== BLOG_IMPACT_SLUG) {
    return false;
  }

  const blogPostId = await findBlogPostId(payload.slug);
  if (!blogPostId) {
    return false;
  }

  const qualified = await hasRecentBlogView(blogPostId, payload.sessionId, payload.userId);
  if (!qualified) {
    return false;
  }

  await prisma.blogInfluenceAction.create({
    data: {
      slug: payload.slug,
      action: payload.action,
      referenceId: payload.referenceId ?? undefined,
      registryItemId: payload.registryItemId ?? undefined,
      sessionId: payload.sessionId ?? undefined,
      userId: payload.userId ?? undefined,
    },
  });

  if (payload.registryItemId) {
    await ensureRegistryItemInfluence(payload.registryItemId, payload.slug);
  }

  return true;
};

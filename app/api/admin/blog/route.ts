import { BlogAuthorRole, BlogStatus, Role } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import {
  upsertBlogHighlights,
  validateBlogPayload,
  ensureUniqueBlogSlug,
} from "@/lib/services/server/blog.service";
import {
  handleMissingBlogTable,
  isBlogFeatureEnabled,
} from "@/lib/blog/blogReadiness";

const requireAdmin = async (request?: Request) => {
  const user = await getUserOrThrow(request);
  if (user.role !== Role.ADMIN) {
    throw new Error("Only admins can manage blog posts.");
  }
  return user;
};

const blogStatusEnum = z.enum([
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
  "ARCHIVED",
]);
const blogAuthorRoleEnum = z.enum(["ADMIN", "MENTOR"]);
const filterSchema = z.object({
  status: blogStatusEnum.optional(),
  authorRole: blogAuthorRoleEnum.optional(),
  isAffiliate: z.enum(["true", "false"]).optional(),
  search: z.string().min(1).optional(),
});

const createEmptyStatusCounts = () =>
  Object.values(BlogStatus).reduce<Record<BlogStatus, number>>((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<BlogStatus, number>);

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    if (!isBlogFeatureEnabled()) {
      return NextResponse.json(
        {
          data: {
            posts: [],
            stats: {
              total: 0,
              statusCounts: createEmptyStatusCounts(),
            },
          },
          meta: { blogDbReady: false },
        },
        { status: 503 },
      );
    }
    const { searchParams } = new URL(request.url);
    const filters = filterSchema.parse({
      status: searchParams.get("status") ?? undefined,
      authorRole: searchParams.get("authorRole") ?? undefined,
      isAffiliate: searchParams.get("isAffiliate") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });

    const where: Prisma.BlogPostWhereInput = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.authorRole) {
      where.authorRoleSnapshot = filters.authorRole;
    }
    if (filters.isAffiliate !== undefined) {
      where.isAffiliate = filters.isAffiliate === "true";
    }
    if (filters.search) {
      const query = filters.search.trim();
      if (query) {
        where.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ];
      }
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        status: true,
        rejectionNote: true,
        updatedAt: true,
        publishedAt: true,
        submittedAt: true,
        authorName: true,
        authorRoleSnapshot: true,
        isAffiliate: true,
      },
    });

    const statusAggregation = await prisma.blogPost.groupBy({
      by: ["status"],
      where,
      _count: { id: true },
    });

    const statusCounts = createEmptyStatusCounts();
    statusAggregation.forEach((row) => {
      statusCounts[row.status] = row._count.id;
    });

    return NextResponse.json({
      data: {
        posts,
        stats: {
          total: posts.length,
          statusCounts,
        },
      },
      meta: { blogDbReady: true },
    });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        {
          data: {
            posts: [],
            stats: {
              total: 0,
              statusCounts: createEmptyStatusCounts(),
            },
          },
          meta: { blogDbReady: false },
        },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to load blog drafts.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin(request);
    if (!isBlogFeatureEnabled()) {
      return NextResponse.json(
        {
          error: "Blog controls are temporarily disabled while database migrations are repaired.",
          meta: { blogDbReady: false },
        },
        { status: 503 },
      );
    }
    const payload = await request.json();
    const validated = await validateBlogPayload(payload);

    const slug = await ensureUniqueBlogSlug(validated.slug);
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: validated.title,
        excerpt: validated.excerpt,
        heroImage: validated.heroImage,
        content: validated.content,
        tags: validated.tags,
        status: "DRAFT",
        isAffiliate: validated.isAffiliate,
        authorId: user.id,
        authorName: user.name || user.email,
        authorRoleSnapshot: "ADMIN",
      },
    });

    await upsertBlogHighlights(post.id, validated.highlights);

    return NextResponse.json({ data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create blog post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

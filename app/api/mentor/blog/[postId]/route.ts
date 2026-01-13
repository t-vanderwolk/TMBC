import { BlogStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import {
  upsertBlogHighlights,
  validateBlogPayload,
  ensureUniqueBlogSlug,
} from "@/lib/services/server/blog.service";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";

type RouteContext = {
  params: { postId: string };
};

const mentorEditableStatuses: Set<BlogStatus> = new Set(["DRAFT", "IN_REVIEW"]);

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== Role.MENTOR && user.role !== Role.ADMIN) {
    throw new Error("Only mentors can manage blog drafts.");
  }
  return user;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireMentor();
    const post = await prisma.blogPost.findUnique({
      where: { id: context.params.postId },
      include: {
        highlights: {
          select: {
            id: true,
            productId: true,
            brandName: true,
            note: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post || (post.authorId !== user.id && user.role !== Role.ADMIN)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog tables are temporarily unavailable." },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to load blog draft.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireMentor();
    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post || (post.authorId !== user.id && user.role !== Role.ADMIN)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (user.role !== Role.ADMIN && !mentorEditableStatuses.has(post.status)) {
      return NextResponse.json(
        { error: "Mentor edits are limited to drafts or in-review posts." },
        { status: 400 },
      );
    }

    const payload = await request.json();
    const validated = await validateBlogPayload(payload);
    const slug = await ensureUniqueBlogSlug(validated.slug, post.id);

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        slug,
        title: validated.title,
        excerpt: validated.excerpt,
        heroImage: validated.heroImage,
        content: validated.content,
        tags: validated.tags,
        isAffiliate: validated.isAffiliate,
      },
    });

    await upsertBlogHighlights(updated.id, validated.highlights);

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog tables are temporarily unavailable." },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to update blog draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

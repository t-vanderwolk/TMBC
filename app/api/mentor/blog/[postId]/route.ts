import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { upsertBlogHighlights, validateMentorBlogPayload } from "@/lib/services/server/mentorBlog.service";

type RouteContext = {
  params: { postId: string };
};

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") {
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
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                imageUrl: true,
                category: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post || (post.authorId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load blog draft.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireMentor();
    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post || (post.authorId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (post.status === "PUBLISHED" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Published posts cannot be edited." }, { status: 400 });
    }

    const payload = await request.json();
    const validated = await validateMentorBlogPayload(payload);

    const slugCollision = await prisma.blogPost.findFirst({
      where: {
        slug: validated.slug,
        NOT: { id: post.id },
      },
      select: { id: true },
    });
    if (slugCollision) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 400 });
    }

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        slug: validated.slug,
        title: validated.title,
        excerpt: validated.excerpt,
        heroImage: validated.heroImage,
        content: validated.content,
        tags: validated.tags,
      },
    });

    await upsertBlogHighlights(updated.id, validated.highlights);

    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update blog draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

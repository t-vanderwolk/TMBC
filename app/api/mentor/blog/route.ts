import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import {
  upsertBlogHighlights,
  validateBlogPayload,
  ensureUniqueBlogSlug,
} from "@/lib/services/server/blog.service";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== Role.MENTOR && user.role !== Role.ADMIN) {
    throw new Error("Only mentors can manage blog drafts.");
  }
  return user;
};

export async function GET() {
  try {
    const user = await requireMentor();
    const posts = await prisma.blogPost.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        status: true,
        updatedAt: true,
        publishedAt: true,
        submittedAt: true,
        isAffiliate: true,
      },
    });

    return NextResponse.json({ data: posts, meta: { blogDbReady: true } });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        {
          error: "Blog tables are temporarily unavailable.",
          meta: { blogDbReady: false },
        },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to load mentor drafts.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireMentor();
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
        authorRoleSnapshot: user.role === Role.ADMIN ? "ADMIN" : "MENTOR",
      },
    });

    await upsertBlogHighlights(post.id, validated.highlights);

    return NextResponse.json({ data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create blog draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

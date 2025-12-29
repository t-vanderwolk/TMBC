import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { upsertBlogHighlights, validateMentorBlogPayload } from "@/lib/services/server/mentorBlog.service";

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") {
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
      },
    });

    return NextResponse.json({ data: posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load mentor drafts.";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireMentor();
    const payload = await request.json();
    const validated = await validateMentorBlogPayload(payload);

    const existing = await prisma.blogPost.findUnique({ where: { slug: validated.slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug: validated.slug,
        title: validated.title,
        excerpt: validated.excerpt,
        heroImage: validated.heroImage,
        content: validated.content,
        tags: validated.tags,
        status: "DRAFT",
        isAffiliate: true,
        authorId: user.id,
        authorName: user.name || user.email,
        authorRoleSnapshot: user.role === "ADMIN" ? "ADMIN" : "MENTOR",
      },
    });

    await upsertBlogHighlights(post.id, validated.highlights);

    return NextResponse.json({ data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create blog draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

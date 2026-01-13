import { BlogAuthorRole, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";

type RouteContext = {
  params: { postId: string };
};

const publishPayloadSchema = z.object({
  authorName: z.string().trim().min(1).optional(),
  authorRoleSnapshot: z.nativeEnum(BlogAuthorRole).optional(),
});

const parseJsonBody = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const requireAdmin = async () => {
  const user = await getUserOrThrow();
  if (user.role !== Role.ADMIN) {
    throw new Error("Only admins can publish blog posts.");
  }
  return user;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const canPublish =
      post.status === "IN_REVIEW" || (post.status === "DRAFT" && post.authorRoleSnapshot === "ADMIN");
    if (!canPublish) {
      return NextResponse.json({ error: "Only submitted posts can be published." }, { status: 400 });
    }

    const payload = publishPayloadSchema.parse(await parseJsonBody(request));

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorName: payload.authorName ?? post.authorName,
        authorRoleSnapshot: payload.authorRoleSnapshot ?? post.authorRoleSnapshot,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog tables are temporarily unavailable." },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to publish blog post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

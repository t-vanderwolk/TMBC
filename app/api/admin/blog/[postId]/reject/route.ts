import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";

type RouteContext = {
  params: { postId: string };
};

const requireAdmin = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "ADMIN") {
    throw new Error("Only admins can reject blog submissions.");
  }
  return user;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    if (post.status !== "IN_REVIEW") {
      return NextResponse.json(
        { error: "Only submitted posts can be rejected." },
        { status: 400 },
      );
    }

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: { status: "DRAFT", submittedAt: null },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog tables are temporarily unavailable." },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to reject blog post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

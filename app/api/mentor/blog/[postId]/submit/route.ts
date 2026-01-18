import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";
import { canSubmitForReview } from "@/lib/blog/blogPermissions";
import { submitForReview } from "@/lib/services/server/blog.service";

type RouteContext = {
  params: { postId: string };
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await getUserOrThrow();
    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post || (post.authorId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    if (!canSubmitForReview(user, post)) {
      const status = user.role === "MENTOR" ? 400 : 403;
      return NextResponse.json(
        { error: "Only mentors may submit their drafts once." },
        { status },
      );
    }

    const updated = await submitForReview(post.id, user.id);

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog tables are temporarily unavailable." },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to submit draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

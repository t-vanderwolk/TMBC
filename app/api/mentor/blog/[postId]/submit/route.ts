import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: { postId: string };
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "MENTOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only mentors can submit drafts." }, { status: 403 });
    }

    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post || (post.authorId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    if (post.status === "PUBLISHED") {
      return NextResponse.json({ error: "Published posts cannot be submitted." }, { status: 400 });
    }

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: { status: "IN_REVIEW", submittedAt: new Date() },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

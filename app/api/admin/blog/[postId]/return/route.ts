import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: { postId: string };
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can return blog drafts." }, { status: 403 });
    }

    const post = await prisma.blogPost.findUnique({ where: { id: context.params.postId } });
    if (!post) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: { status: "DRAFT", submittedAt: null },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to return blog draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

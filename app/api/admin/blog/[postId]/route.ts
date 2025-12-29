import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: { postId: string };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can review blog drafts." }, { status: 403 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: context.params.postId },
      include: {
        highlights: {
          orderBy: { createdAt: "asc" },
          include: {
            product: { select: { id: true, name: true, brand: true, imageUrl: true, category: true } },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load blog draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

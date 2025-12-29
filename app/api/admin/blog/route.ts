import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can review blog drafts." }, { status: 403 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        status: true,
        updatedAt: true,
        publishedAt: true,
        authorName: true,
        authorRoleSnapshot: true,
      },
    });

    return NextResponse.json({ data: posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load blog drafts.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

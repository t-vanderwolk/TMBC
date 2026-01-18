import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";
import { approvePost } from "@/lib/services/server/blog.service";

type RouteContext = {
  params: { postId: string };
};

const requireAdmin = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "ADMIN") {
    throw new Error("Only admins can approve blog submissions.");
  }
  return user;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const admin = await requireAdmin();

    const updated = await approvePost(context.params.postId, admin.id);

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (handleMissingBlogTable(error)) {
      return NextResponse.json(
        { error: "Blog tables are temporarily unavailable." },
        { status: 503 },
      );
    }
    const message = error instanceof Error ? error.message : "Unable to approve blog post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

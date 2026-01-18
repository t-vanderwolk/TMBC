import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";
import { rejectPost } from "@/lib/services/server/blog.service";

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

export async function POST(request: Request, context: RouteContext) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const note = typeof body?.note === "string" ? body.note.trim() : "";
    if (!note) {
      return NextResponse.json({ error: "Rejection note is required." }, { status: 400 });
    }
    const updated = await rejectPost(context.params.postId, admin.id, note);

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

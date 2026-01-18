import { BlogAuthorRole, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";
import { publishPost } from "@/lib/services/server/blog.service";

type RouteContext = {
  params: { postId: string };
};

const blogAuthorRoleEnum = z.enum(["ADMIN", "MENTOR"]);
const publishPayloadSchema = z.object({
  authorName: z.string().trim().min(1).optional(),
  authorRoleSnapshot: blogAuthorRoleEnum.optional(),
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
    const admin = await requireAdmin();
    const payload = publishPayloadSchema.parse(await parseJsonBody(request));
    const updated = await publishPost(context.params.postId, admin.id, {
      authorName: payload.authorName,
      authorRoleSnapshot: payload.authorRoleSnapshot,
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

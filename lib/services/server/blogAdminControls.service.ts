import { BlogStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AdminBlogControlPost = {
  id: string;
  title: string;
  status: BlogStatus;
  submittedAt: Date | null;
  authorName: string;
  authorRoleSnapshot: "ADMIN" | "MENTOR";
  isAffiliate: boolean;
  affiliateLinkCount: number;
};

export type AdminBlogControlSnapshot = {
  counts: Record<BlogStatus, number>;
  recentPosts: AdminBlogControlPost[];
};

export type AdminBlogControlSnapshotPayload = AdminBlogControlSnapshot & {
  blogDbReady: boolean;
};

const createEmptyCounts = () =>
  Object.values(BlogStatus).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<BlogStatus, number>);

const buildSnapshot = (groups: { status: BlogStatus; _count: { id: number } }[], recentPosts: Awaited<ReturnType<typeof prisma.blogPost.findMany>>) => {
  const counts = createEmptyCounts();
  groups.forEach((group) => {
    counts[group.status] = group._count.id;
  });

  return {
    counts,
    recentPosts: recentPosts.map((post) => ({
      id: post.id,
      title: post.title,
      status: post.status,
      submittedAt: post.submittedAt,
      authorName: post.authorName,
      authorRoleSnapshot: post.authorRoleSnapshot,
      isAffiliate: post.isAffiliate,
      affiliateLinkCount: post._count.affiliateLinks,
    })),
  };
};

const isBlogTableMissingError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError =>
  typeof error === "object" &&
  error !== null &&
  (error as Prisma.PrismaClientKnownRequestError).code === "P2021";

const buildEmptySnapshot = (): AdminBlogControlSnapshot => ({
  counts: createEmptyCounts(),
  recentPosts: [],
});

export async function getAdminBlogControlSnapshot(): Promise<AdminBlogControlSnapshotPayload> {
  try {
    const [groups, recentPosts] = await Promise.all([
      prisma.blogPost.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: [
          { submittedAt: "desc" },
          { updatedAt: "desc" },
        ],
        select: {
          id: true,
          title: true,
          status: true,
          submittedAt: true,
          authorName: true,
          authorRoleSnapshot: true,
          isAffiliate: true,
          _count: {
            select: {
              affiliateLinks: true,
            },
          },
        },
      }),
    ]);

    return {
      ...buildSnapshot(groups, recentPosts),
      blogDbReady: true,
    };
  } catch (error) {
    if (isBlogTableMissingError(error)) {
      const missingTable = typeof error.meta?.table === "string" ? error.meta.table : "unknown";
      console.warn("BLOG_DB_NOT_READY", { missingTable, code: "P2021" });
      return {
        ...buildEmptySnapshot(),
        blogDbReady: false,
      };
    }

    throw error;
  }
}

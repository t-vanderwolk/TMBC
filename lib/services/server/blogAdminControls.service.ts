import { BlogStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { handleMissingBlogTable } from "@/lib/services/server/blogDatabaseGuard.service";
import { isPrismaBlogSchemaError } from "@/lib/blog/blogReadiness";

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

const blogPostSnapshotSelect = {
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
} satisfies Prisma.BlogPostSelect;

type BlogPostSnapshotRow = Prisma.BlogPostGetPayload<{
  select: typeof blogPostSnapshotSelect;
}>;

const createEmptyCounts = () =>
  Object.values(BlogStatus).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<BlogStatus, number>);

const buildSnapshot = (
  groups: { status: BlogStatus; _count: { id: number } }[],
  recentPosts: BlogPostSnapshotRow[],
) => {
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

const buildEmptySnapshot = (): AdminBlogControlSnapshot => ({
  counts: createEmptyCounts(),
  recentPosts: [],
});

export const createEmptyAdminBlogControlSnapshotPayload = (): AdminBlogControlSnapshotPayload => ({
  ...buildEmptySnapshot(),
  blogDbReady: false,
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
        select: blogPostSnapshotSelect,
      }),
    ]);

    return {
      ...buildSnapshot(groups, recentPosts),
      blogDbReady: true,
    };
  } catch (error) {
    if (handleMissingBlogTable(error) || isPrismaBlogSchemaError(error)) {
      return createEmptyAdminBlogControlSnapshotPayload();
    }

    throw error;
  }
}

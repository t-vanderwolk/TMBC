import { BlogStatus } from "@prisma/client";

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

export async function getAdminBlogControlSnapshot(): Promise<AdminBlogControlSnapshot> {
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

  const counts: Record<BlogStatus, number> = Object.values(BlogStatus).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<BlogStatus, number>);
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
}

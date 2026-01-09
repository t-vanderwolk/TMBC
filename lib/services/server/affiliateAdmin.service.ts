import { prisma } from "@/lib/prisma";
import { decodeAffiliateDestination, encodeAffiliateDestination } from "@/lib/services/server/affiliateLinkMetadata";
import { getAllPartnerNotes, setPartnerNote } from "@/lib/data/adminAffiliateNotes";
import type {
  AffiliateAnalyticsRow,
  AffiliateNetwork,
  AffiliatePartnerStatus,
  AffiliatePartnerUsage,
  AffiliatePosition,
  AdminAffiliatePartner,
  AdminBlogAffiliateLink,
  AdminBlogLinksPayload,
  BlogPostSummary,
} from "@/types/adminAffiliates";

type PartnerStatusUpdate = {
  status?: AffiliatePartnerStatus;
  note?: string | null;
};

type BlogLinkCreatePayload = {
  blogPostId: string;
  partnerName: string;
  network: AffiliateNetwork;
  label: string;
  position: AffiliatePosition;
  destinationUrl: string;
  isPrimary?: boolean;
};

type BlogLinkUpdatePayload = {
  destinationUrl?: string;
  isPrimary?: boolean;
  status?: AffiliatePartnerStatus;
  label?: string;
  position?: AffiliatePosition;
};

const usageFor = (hasBlog: boolean, hasRegistry: boolean): AffiliatePartnerUsage => {
  if (hasBlog && hasRegistry) return "BOTH";
  if (hasBlog) return "BLOG";
  if (hasRegistry) return "REGISTRY";
  return "NONE";
};

export const listAdminAffiliatePartners = async (): Promise<AdminAffiliatePartner[]> => {
  const [partners, blogLinks, registryCounts, partnerNotes] = await Promise.all([
    prisma.affiliatePartner.findMany(),
    prisma.blogAffiliateLink.findMany({ select: { id: true, partnerName: true, destinationUrl: true } }),
    prisma.registryItem.groupBy({
      by: ["affiliateId"],
      _count: { id: true },
    }),
    getAllPartnerNotes(),
  ]);

  const linkStats = new Map<string, { links: number; active: number; paused: number }>();
  const linkById = new Map<string, { partnerName: string; destinationUrl: string }>();
  for (const link of blogLinks) {
    linkById.set(link.id, link);
    const key = link.partnerName;
    const decoded = decodeAffiliateDestination(link.destinationUrl);
    const status = decoded?.status ?? "ACTIVE";
    const bucket = linkStats.get(key) ?? { links: 0, active: 0, paused: 0 };
    bucket.links += 1;
    if (status === "ACTIVE") {
      bucket.active += 1;
    } else {
      bucket.paused += 1;
    }
    linkStats.set(key, bucket);
  }

  const lastClickByPartner = new Map<string, Date>();
  const events = await prisma.blogAffiliateEvent.findMany({
    where: { affiliateLinkId: { in: Array.from(linkById.keys()) }, event: "CLICK" },
    orderBy: { createdAt: "desc" },
    select: { affiliateLinkId: true, createdAt: true },
  });
  for (const event of events) {
    const link = linkById.get(event.affiliateLinkId);
    if (!link) continue;
    if (!lastClickByPartner.has(link.partnerName)) {
      lastClickByPartner.set(link.partnerName, event.createdAt);
    }
  }

  const registryMap = new Map<string, number>();
  for (const entry of registryCounts) {
    if (entry.affiliateId) {
      registryMap.set(entry.affiliateId, entry._count.id);
    }
  }

  return partners.map((partner) => {
    const key = partner.name;
    const stats = linkStats.get(key) ?? { links: 0, active: 0, paused: 0 };
    const hasBlogLinks = stats.links > 0;
    const hasRegistry = Boolean(registryMap.get(partner.id));
    const status = stats.active > 0 ? "ACTIVE" : "PAUSED";
    const lastClick = lastClickByPartner.get(key) ?? null;
    return {
      id: partner.id,
      name: partner.name,
      network: partner.network as AffiliateNetwork,
      status,
      usage: usageFor(hasBlogLinks, hasRegistry),
      lastClickAt: lastClick ? lastClick.toISOString() : null,
      note: partnerNotes[partner.id] ?? null,
      blogLinkCount: stats.links,
      activeLinkCount: stats.active,
      pausedLinkCount: stats.paused,
    };
  });
};

export const updateAdminAffiliatePartner = async (
  partnerId: string,
  payload: PartnerStatusUpdate,
): Promise<void> => {
  const partner = await prisma.affiliatePartner.findUnique({ where: { id: partnerId } });
  if (!partner) {
    throw new Error("Partner not found");
  }

  if (payload.status) {
    const links = await prisma.blogAffiliateLink.findMany({
      where: { partnerName: partner.name },
      select: { id: true, destinationUrl: true, blogPostId: true },
    });
    await Promise.all(
      links.map(async (link) => {
        const decoded = decodeAffiliateDestination(link.destinationUrl);
        const baseUrl = decoded?.url ?? "";
        const destination = encodeAffiliateDestination({
          url: baseUrl,
          status: payload.status!,
        });
        await prisma.blogAffiliateLink.update({
          where: { id: link.id },
          data: { destinationUrl: destination },
        });
      }),
    );
  }

  if (payload.note !== undefined) {
    await setPartnerNote(partner.id, payload.note);
  }
};

export const listAdminBlogAffiliateLinks = async (): Promise<AdminBlogLinksPayload> => {
  const [links, posts, partners] = await Promise.all([
    prisma.blogAffiliateLink.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        blogPost: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, slug: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.affiliatePartner.findMany({ select: { id: true, name: true } }),
  ]);

  const clickCounts = await prisma.blogAffiliateEvent.groupBy({
    by: ["affiliateLinkId"],
    where: { event: "CLICK" },
    _count: { id: true },
  });
  const clickMap = new Map(clickCounts.map((count) => [count.affiliateLinkId, count._count.id]));

  const formattedLinks: AdminBlogAffiliateLink[] = links.map((link) => {
    const decoded = decodeAffiliateDestination(link.destinationUrl);
    return {
      id: link.id,
      blogPost: {
        id: link.blogPost.id,
        title: link.blogPost.title,
        slug: link.blogPost.slug,
      },
      partnerName: link.partnerName,
      label: link.label,
      position: link.position as AffiliatePosition,
      isPrimary: link.isPrimary,
      status: decoded?.status ?? "ACTIVE",
      destinationUrl: decoded?.url ?? "",
      clickCount: clickMap.get(link.id) ?? 0,
      createdAt: link.createdAt.toISOString(),
    };
  });

  const postSummaries: BlogPostSummary[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
  }));

  return {
    links: formattedLinks,
    posts: postSummaries,
    partners,
  };
};

export const createAdminBlogAffiliateLink = async (payload: BlogLinkCreatePayload): Promise<void> => {
  const hasPost = await prisma.blogPost.findUnique({ where: { id: payload.blogPostId }, select: { id: true } });
  if (!hasPost) {
    throw new Error("Blog post not found");
  }

  if (payload.isPrimary) {
    await prisma.blogAffiliateLink.updateMany({
      where: { blogPostId: payload.blogPostId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  await prisma.blogAffiliateLink.create({
    data: {
      blogPostId: payload.blogPostId,
      partnerName: payload.partnerName,
      network: payload.network,
      label: payload.label,
      position: payload.position,
      isPrimary: payload.isPrimary ?? false,
      destinationUrl: encodeAffiliateDestination({
        url: payload.destinationUrl,
        status: "ACTIVE",
      }),
    },
  });
};

export const updateAdminBlogAffiliateLink = async (id: string, payload: BlogLinkUpdatePayload): Promise<void> => {
  const link = await prisma.blogAffiliateLink.findUnique({
    where: { id },
  });
  if (!link) {
    throw new Error("Affiliate link not found");
  }

  const updates: Record<string, any> = {};
  let destination = decodeAffiliateDestination(link.destinationUrl);
  if (!destination) {
    destination = { url: "", status: "ACTIVE" };
  }

  if (payload.destinationUrl) {
    destination.url = payload.destinationUrl;
  }
  if (payload.status) {
    destination.status = payload.status;
  }

  updates.destinationUrl = encodeAffiliateDestination(destination);

  if (payload.label) {
    updates.label = payload.label;
  }
  if (payload.position) {
    updates.position = payload.position;
  }
  if (typeof payload.isPrimary === "boolean") {
    if (payload.isPrimary) {
      await prisma.blogAffiliateLink.updateMany({
        where: { blogPostId: link.blogPostId, isPrimary: true },
        data: { isPrimary: false },
      });
    }
    updates.isPrimary = payload.isPrimary;
  }

  await prisma.blogAffiliateLink.update({
    where: { id },
    data: updates,
  });
};

const weekKey = (date: Date): string => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  const diff = (normalized.getDay() + 6) % 7;
  normalized.setDate(normalized.getDate() - diff);
  const firstOfYear = new Date(normalized.getFullYear(), 0, 1);
  const weekNumber =
    Math.floor((normalized.getTime() - firstOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  return `${normalized.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
};

export const fetchAffiliateAnalytics = async (): Promise<AffiliateAnalyticsRow[]> => {
  const windowStart = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const events = await prisma.blogAffiliateEvent.findMany({
    where: {
      event: "CLICK",
      createdAt: { gte: windowStart },
    },
    orderBy: { createdAt: "asc" },
    include: {
      blogPost: { select: { id: true, title: true, slug: true } },
      affiliateLink: { select: { id: true, partnerName: true } },
    },
  });

  type Accumulator = {
    blogPostId: string;
    blogPostTitle: string;
    blogPostSlug: string;
    partnerName: string;
    totalClicks: number;
    lastClickedAt: Date | null;
    byDay: Map<string, number>;
    byWeek: Map<string, number>;
  };

  const rowsMap = new Map<string, Accumulator>();

  for (const event of events) {
    if (!event.blogPost || !event.affiliateLink) continue;
    const key = `${event.blogPost.id}::${event.affiliateLink.partnerName}`;
    const current = rowsMap.get(key) ?? {
      blogPostId: event.blogPost.id,
      blogPostTitle: event.blogPost.title,
      blogPostSlug: event.blogPost.slug,
      partnerName: event.affiliateLink.partnerName,
      totalClicks: 0,
      lastClickedAt: null,
      byDay: new Map(),
      byWeek: new Map(),
    };

    current.totalClicks += 1;
    if (!current.lastClickedAt || event.createdAt > current.lastClickedAt) {
      current.lastClickedAt = event.createdAt;
    }

    const dayKey = event.createdAt.toISOString().slice(0, 10);
    current.byDay.set(dayKey, (current.byDay.get(dayKey) ?? 0) + 1);

    const week = weekKey(event.createdAt);
    current.byWeek.set(week, (current.byWeek.get(week) ?? 0) + 1);

    rowsMap.set(key, current);
  }

  return Array.from(rowsMap.values()).map((row) => ({
    blogPostId: row.blogPostId,
    blogPostTitle: row.blogPostTitle,
    blogPostSlug: row.blogPostSlug,
    partnerName: row.partnerName,
    totalClicks: row.totalClicks,
    lastClickedAt: row.lastClickedAt ? row.lastClickedAt.toISOString() : null,
    clicksByDay: Array.from(row.byDay.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([date, count]) => ({ date, count })),
    clicksByWeek: Array.from(row.byWeek.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([week, count]) => ({ week, count })),
  }));
};

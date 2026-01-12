import { prisma } from "@/lib/prisma";
import {
  decodeAffiliateDestination,
  encodeAffiliateDestination,
  type AffiliateLinkStatus,
} from "@/lib/services/server/affiliateLinkMetadata";
import type { AffiliateMetadataEntry } from "@/lib/data/adminAffiliateMetadata";
import {
  listAffiliateMetadata,
  updateAffiliateMetadata,
} from "@/lib/data/adminAffiliateMetadata";
import type {
  AffiliateAnalyticsRow,
  AffiliateNetwork,
  AffiliatePartnerStatus,
  AffiliatePartnerRole,
  AffiliatePartnerUsage,
  AffiliateIds,
  AffiliateVisibility,
  AffiliateBlogSettings,
  AffiliateRegistrySettings,
  AffiliatePosition,
  AdminAffiliatePartner,
  AdminBlogAffiliateLink,
  AdminBlogLinksPayload,
  BlogPostSummary,
} from "@/types/adminAffiliates";

type PartnerUpdatePayload = {
  name?: string;
  network?: AffiliateNetwork;
  defaultLink?: string | null;
  cookieWindow?: number | null;
  commissionRate?: string | null;
  status?: AffiliatePartnerStatus;
  category?: string | null;
  role?: AffiliatePartnerRole;
  visibility?: Partial<AffiliateVisibility>;
  blogSettings?: Partial<AffiliateBlogSettings>;
  registrySettings?: Partial<AffiliateRegistrySettings>;
  affiliateIds?: AffiliateIds;
  internalNotes?: string | null;
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
  partnerName?: string;
  network?: AffiliateNetwork;
};

const usageFor = (hasBlog: boolean, hasRegistry: boolean): AffiliatePartnerUsage => {
  if (hasBlog && hasRegistry) return "BOTH";
  if (hasBlog) return "BLOG";
  if (hasRegistry) return "REGISTRY";
  return "NONE";
};

export const listAdminAffiliatePartners = async (): Promise<AdminAffiliatePartner[]> => {
  const [partners, blogLinks, registryCounts, metadata] = await Promise.all([
    prisma.affiliatePartner.findMany(),
    prisma.blogAffiliateLink.findMany({ select: { id: true, partnerName: true, destinationUrl: true } }),
    prisma.registryItem.groupBy({
      by: ["affiliateId"],
      _count: { id: true },
    }),
    listAffiliateMetadata(),
  ]);

  type PartnerStats = {
    links: number;
    active: number;
    paused: number;
    clickCount: number;
    lastClickAt: Date | null;
  };

  const linkStats = new Map<string, PartnerStats>();
  const linkLookup = new Map<string, string>();

  const ensureStats = (partnerName: string) => {
    const existing = linkStats.get(partnerName);
    if (existing) return existing;
    const next: PartnerStats = { links: 0, active: 0, paused: 0, clickCount: 0, lastClickAt: null };
    linkStats.set(partnerName, next);
    return next;
  };

  for (const link of blogLinks) {
    linkLookup.set(link.id, link.partnerName);
    const key = link.partnerName;
    const decoded = decodeAffiliateDestination(link.destinationUrl);
    const status = decoded?.status ?? "ACTIVE";
    const stats = ensureStats(key);
    stats.links += 1;
    if (status === "ACTIVE") {
      stats.active += 1;
    } else {
      stats.paused += 1;
    }
  }

  const clickCounts = await prisma.blogAffiliateEvent.groupBy({
    by: ["affiliateLinkId"],
    where: { affiliateLinkId: { in: Array.from(linkLookup.keys()) }, event: "CLICK" },
    _count: { id: true },
  });
  for (const row of clickCounts) {
    const partnerName = linkLookup.get(row.affiliateLinkId);
    if (!partnerName) continue;
    const stats = ensureStats(partnerName);
    stats.clickCount += row._count.id;
  }

  const lastClicks = await prisma.blogAffiliateEvent.findMany({
    where: { affiliateLinkId: { in: Array.from(linkLookup.keys()) }, event: "CLICK" },
    orderBy: { createdAt: "desc" },
    select: { affiliateLinkId: true, createdAt: true },
  });
  for (const event of lastClicks) {
    const partnerName = linkLookup.get(event.affiliateLinkId);
    if (!partnerName || linkStats.get(partnerName)?.lastClickAt) continue;
    const stats = ensureStats(partnerName);
    stats.lastClickAt = event.createdAt;
  }

  const registryMap = new Map<string, number>();
  for (const entry of registryCounts) {
    if (entry.affiliateId) {
      registryMap.set(entry.affiliateId, entry._count.id);
    }
  }

  const formatPartner = (partner: typeof partners[number]): AdminAffiliatePartner => {
    const stats = linkStats.get(partner.name) ?? {
      links: 0,
      active: 0,
      paused: 0,
      clickCount: 0,
      lastClickAt: null,
    };
    const partnerMeta = metadata[partner.id];
    const hasBlogLink = stats.links > 0;
    const hasRegistryItem = Boolean(registryMap.get(partner.id));
    const status: AffiliatePartnerStatus =
      partnerMeta?.status ??
      (stats.active > 0 ? "ACTIVE" : stats.links > 0 ? "AT_RISK" : "PAUSED");
    const visibility: AffiliateVisibility = {
      blogEligible: partnerMeta?.visibility?.blogEligible ?? hasBlogLink,
      registryEligible: partnerMeta?.visibility?.registryEligible ?? hasRegistryItem,
      mentorVisible: partnerMeta?.visibility?.mentorVisible ?? true,
    };
    const blogSettings: AffiliateBlogSettings = {
      eligible: partnerMeta?.blogSettings?.eligible ?? hasBlogLink,
      defaultCta: partnerMeta?.blogSettings?.defaultCta ?? "Shop",
      placement: "END_CARD",
      primaryEligible: partnerMeta?.blogSettings?.primaryEligible ?? true,
    };
    const registrySettings: AffiliateRegistrySettings = {
      retailerTier: partnerMeta?.registrySettings?.retailerTier,
      priority: partnerMeta?.registrySettings?.priority ?? undefined,
      categoryExclusions: partnerMeta?.registrySettings?.categoryExclusions ?? [],
      fallbackToBrandDirect: partnerMeta?.registrySettings?.fallbackToBrandDirect ?? false,
    };
    const usage = usageFor(hasBlogLink, hasRegistryItem);

    return {
      id: partner.id,
      name: partner.name,
      network: partner.network as AffiliateNetwork,
      status,
      usage,
      category: partnerMeta?.category ?? null,
      role: partnerMeta?.role ?? "Brand",
      commissionRate: partnerMeta?.commissionRate ?? null,
      visibility,
      blogSettings,
      registrySettings,
      affiliateIds: partnerMeta?.affiliateIds ?? {},
      defaultLink: partner.defaultLink ?? null,
      cookieWindow: partner.cookieDays ?? null,
      internalNotes: partnerMeta?.internalNotes ?? null,
      lastClickAt: stats.lastClickAt ? stats.lastClickAt.toISOString() : null,
      note: partnerMeta?.internalNotes ?? null,
      blogLinkCount: stats.links,
      activeLinkCount: stats.active,
      pausedLinkCount: stats.paused,
      clickCount: stats.clickCount,
      hasBlogLink,
      hasRegistryItem,
    };
  };

  return partners.map(formatPartner);
};

export const getAdminAffiliatePartnerById = async (
  partnerId: string,
): Promise<AdminAffiliatePartner | null> => {
  const partners = await listAdminAffiliatePartners();
  return partners.find((partner) => partner.id === partnerId) ?? null;
};

export const updateAdminAffiliatePartner = async (
  partnerId: string,
  payload: PartnerUpdatePayload,
): Promise<AdminAffiliatePartner> => {
  const partner = await prisma.affiliatePartner.findUnique({ where: { id: partnerId } });
  if (!partner) {
    throw new Error("Partner not found");
  }

  const updates: Record<string, unknown> = {};
  if (payload.name) {
    updates.name = payload.name;
  }
  if (payload.network) {
    updates.network = payload.network;
  }
  if (payload.defaultLink !== undefined) {
    updates.defaultLink = payload.defaultLink;
  }
  if (payload.cookieWindow !== undefined) {
    updates.cookieDays = payload.cookieWindow;
  }
  if (Object.keys(updates).length) {
    await prisma.affiliatePartner.update({ where: { id: partnerId }, data: updates });
  }

  const currentPartner = await prisma.affiliatePartner.findUnique({ where: { id: partnerId } });
  if (!currentPartner) {
    throw new Error("Partner not found after update");
  }

  if (payload.status && payload.status !== "AT_RISK") {
    const links = await prisma.blogAffiliateLink.findMany({
      where: { partnerName: currentPartner.name },
      select: { id: true, destinationUrl: true },
    });
    await Promise.all(
      links.map(async (link) => {
        const decoded = decodeAffiliateDestination(link.destinationUrl);
        const baseUrl = decoded?.url ?? "";
      const destination = encodeAffiliateDestination({
        url: baseUrl,
        status: (payload.status === "PAUSED" ? "PAUSED" : "ACTIVE") as AffiliateLinkStatus,
      });
        await prisma.blogAffiliateLink.update({
          where: { id: link.id },
          data: { destinationUrl: destination },
        });
      }),
    );
  }

  const metadataUpdate: Partial<AffiliateMetadataEntry> = {
    category: payload.category ?? undefined,
    role: payload.role,
    commissionRate: payload.commissionRate ?? undefined,
    status: payload.status,
    visibility: payload.visibility,
    blogSettings: payload.blogSettings,
    registrySettings: payload.registrySettings,
    affiliateIds: payload.affiliateIds,
  };
  if (payload.internalNotes !== undefined) {
    metadataUpdate.internalNotes = payload.internalNotes;
  } else if (payload.note !== undefined) {
    metadataUpdate.internalNotes = payload.note;
  }
  await updateAffiliateMetadata(partnerId, metadataUpdate);

  const refreshed = await getAdminAffiliatePartnerById(partnerId);
  if (!refreshed) {
    throw new Error("Unable to load partner after update");
  }
  return refreshed;
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
      destination.status = (payload.status === "PAUSED" ? "PAUSED" : "ACTIVE") as AffiliateLinkStatus;
    }

  updates.destinationUrl = encodeAffiliateDestination(destination);

  if (payload.label) {
    updates.label = payload.label;
  }
  if (payload.position) {
    updates.position = payload.position;
  }
  if (payload.partnerName) {
    updates.partnerName = payload.partnerName;
  }
  if (payload.network) {
    updates.network = payload.network;
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

export const listAffiliateLinksForPost = async (blogPostId: string) => {
  const links = await prisma.blogAffiliateLink.findMany({
    where: { blogPostId },
    orderBy: { createdAt: "asc" },
  });

  const clickCounts = await prisma.blogAffiliateEvent.groupBy({
    by: ["affiliateLinkId"],
    where: {
      affiliateLinkId: { in: links.map((link) => link.id) },
      event: "CLICK",
    },
    _count: { id: true },
  });
  const clickMap = new Map(clickCounts.map((row) => [row.affiliateLinkId, row._count.id]));

  return links.map((link) => {
    const decoded = decodeAffiliateDestination(link.destinationUrl);
    return {
      id: link.id,
      partnerName: link.partnerName,
      network: link.network as AffiliateNetwork,
      label: link.label,
      position: link.position as AffiliatePosition,
      isPrimary: link.isPrimary,
      status: decoded?.status ?? "ACTIVE",
      destinationUrl: decoded?.url ?? "",
      clickCount: clickMap.get(link.id) ?? 0,
      createdAt: link.createdAt.toISOString(),
    };
  });
};

export const deleteAdminBlogAffiliateLink = async (id: string) => {
  await prisma.blogAffiliateLink.delete({ where: { id } });
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

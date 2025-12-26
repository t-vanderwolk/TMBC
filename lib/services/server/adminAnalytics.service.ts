/* 
  Scan notes:
  - RegistryItem supplies the base decision signal (fields: purchaseSource, status, section, category, merchant, price, quantity, createdAt, updatedAt, addedByMentor, notes, mentorNote, userNote, affiliateId, affiliateLink).
  - Registry provides the container per user and is linked via registryId; users expose mentorId/name for attribution.
  - MentorFeedback is threaded to RegistryItem; AffiliatePartner gives network metadata.
  - New RegistryItemBlogInfluence models blog slugs tied to registry items so we can join content data.
  Gaps addressed with heuristics: decisionStatus isn’t explicit so we infer from purchaseSource + status + timestamps, revenue lacks confirmed commissions so we derive estimates, and blog influence counts are stored in the newly added influence table.
*/

import { Prisma, RegistryItemStatus } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { MYREGISTRY_CANON, MYREGISTRY_SIGNUP_COMPLETED } from '@/lib/constants/affiliateCanon';
import type { AdminAnalyticsPayload, AffiliateDecisionSource } from '@/types/adminAnalytics';

const ALLOWED_RANGE_DAYS = [7, 30, 90];
const DEFAULT_RANGE_DAYS = 30;
const MODIFIED_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
const PENDING_DECISION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CONFIDENCE_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const COMMISSION_RATES: Record<string, number> = {
  DIRECT: 0.08,
  IMPACT: 0.06,
  AWIN: 0.055,
  CJ: 0.05,
  SHAREASALE: 0.045,
  MYREGISTRY: 0.03,
  AMAZON: 0.04,
};

const DECISION_SOURCES: AffiliateDecisionSource[] = [
  'seeded_onboarding',
  'seeded_modified',
  'mentor_suggested',
  'academy_driven',
  'blog_influenced',
];

const ACCEPTED_STATUSES: RegistryItemStatus[] = [
  RegistryItemStatus.ADDED,
  RegistryItemStatus.PURCHASED,
];
const TIME_TRACKED_STATUSES: RegistryItemStatus[] = [
  RegistryItemStatus.ADDED,
  RegistryItemStatus.PURCHASED,
  RegistryItemStatus.REMOVED,
];

const normalizeRangeDays = (value?: number) => {
  if (!value) return DEFAULT_RANGE_DAYS;
  const rounded = Math.floor(Number(value));
  if (Number.isNaN(rounded)) return DEFAULT_RANGE_DAYS;
  if (!ALLOWED_RANGE_DAYS.includes(rounded)) return DEFAULT_RANGE_DAYS;
  return rounded;
};

const calculateRangeStart = (rangeDays: number) => {
  const now = Date.now();
  return new Date(now - rangeDays * 24 * 60 * 60 * 1000);
};

const formatPercent = (value: number, total: number) => (total ? (value / total) * 100 : 0);

type PricedItem = {
  price?: number | null;
  quantity?: number | null;
};

const orderValue = (item: PricedItem) => {
  const quantity = item.quantity ?? 1;
  const price = item.price ?? 0;
  return price * quantity;
};

const PRODUCT_ANALYTICS_SELECT = {
  id: true,
  name: true,
  brand: true,
  category: true,
  subcategory: true,
} as const;

const USER_ANALYTICS_SELECT = {
  id: true,
  name: true,
  mentorId: true,
} as const;

const REGISTRY_ANALYTICS_SELECT = {
  id: true,
} as const;

const AFFILIATE_ANALYTICS_SELECT = {
  id: true,
  name: true,
  network: true,
} as const;

const BLOG_INFLUENCE_REGISTRY_ITEM_SELECT = {
  id: true,
  userId: true,
  registryId: true,
  status: true,
  source: true,
  purchaseSource: true,
  section: true,
  category: true,
  brand: true,
  merchant: true,
  price: true,
  createdAt: true,
  updatedAt: true,
  addedByMentor: true,
  registry: { select: REGISTRY_ANALYTICS_SELECT },
  user: { select: USER_ANALYTICS_SELECT },
  product: { select: PRODUCT_ANALYTICS_SELECT },
  affiliate: { select: AFFILIATE_ANALYTICS_SELECT },
} as const;

const resolveNetwork = (item: AnalyticsItem) => {
  const merchant = (item.merchant ?? item.product?.brand ?? '').toLowerCase();
  if (merchant.includes('macrobaby')) {
    return 'DIRECT';
  }
  if (merchant.includes('amazon')) {
    return 'AMAZON';
  }
  if (item.affiliate?.network) {
    return item.affiliate.network;
  }
  return 'MYREGISTRY';
};

const commissionRateForNetwork = (network: string) => COMMISSION_RATES[network] ?? 0.035;

const isSeededOnboarding = (item: AnalyticsItem) => {
  const normalizedSource = item.source?.toLowerCase();
  return item.purchaseSource === 'recommendation' || normalizedSource === 'onboarding';
};

const resolveDecisionSource = (item: AnalyticsItem): AffiliateDecisionSource => {
  if (item.blogInfluences?.length) {
    return 'blog_influenced';
  }
  if (isSeededOnboarding(item)) {
    if (
      item.status === RegistryItemStatus.PURCHASED &&
      item.updatedAt.getTime() - item.createdAt.getTime() > MODIFIED_THRESHOLD_MS
    ) {
      return 'seeded_modified';
    }
    return 'seeded_onboarding';
  }
  if (item.addedByMentor) {
    return 'mentor_suggested';
  }
  if (item.source?.length) {
    return 'academy_driven';
  }
  return 'academy_driven';
};

type AnalyticsItem = Prisma.RegistryItemGetPayload<{
  include: {
    user: { select: typeof USER_ANALYTICS_SELECT };
    registry: { select: typeof REGISTRY_ANALYTICS_SELECT };
    affiliate: { select: typeof AFFILIATE_ANALYTICS_SELECT };
    product: { select: typeof PRODUCT_ANALYTICS_SELECT };
    blogInfluences: true;
  };
}>;

export const getAdminAnalytics = async (options?: { rangeDays?: number }): Promise<AdminAnalyticsPayload> => {
  const rangeDays = normalizeRangeDays(options?.rangeDays);
  const rangeStart = calculateRangeStart(rangeDays);
  let blogMetaBySlug = new Map<string, string>();

  const seededItems = await prisma.registryItem.findMany({
    where: {
      purchaseSource: 'recommendation',
      OR: [
        { createdAt: { gte: rangeStart } },
        { updatedAt: { gte: rangeStart } },
      ],
    },
    include: {
      user: { select: USER_ANALYTICS_SELECT },
      registry: { select: REGISTRY_ANALYTICS_SELECT },
      affiliate: { select: AFFILIATE_ANALYTICS_SELECT },
      product: { select: PRODUCT_ANALYTICS_SELECT },
      blogInfluences: true,
    },
  }) as AnalyticsItem[];

  try {
    const blogPosts = await prisma.blogPost.findMany({
      select: { slug: true, title: true },
    });
    blogMetaBySlug = new Map(blogPosts.map((post) => [post.slug, post.title]));
  } catch (error) {
    console.warn('admin analytics: unable to load blog metadata', error);
  }

  const seededItemIds = seededItems.map((item) => item.id);

  const uniqueRegistryKeys = new Set<string>();
  const registryCompletion = new Map<string, { seeded: number; completed: number }>();

  let accepted = 0;
  let modified = 0;
  let deferred = 0;
  let confidencePurchases = 0;
  let confidenceStable = 0;

  seededItems.forEach((item) => {
    const registryKey = item.registryId ?? `user:${item.userId}`;
    uniqueRegistryKeys.add(registryKey);

    if (!registryCompletion.has(registryKey)) {
      registryCompletion.set(registryKey, { seeded: 0, completed: 0 });
    }
    const bucket = registryCompletion.get(registryKey)!;
    bucket.seeded += 1;

    const duration = item.updatedAt.getTime() - item.createdAt.getTime();
    const isPurchased = item.status === RegistryItemStatus.PURCHASED;
    const isAcceptedStatus = ACCEPTED_STATUSES.includes(item.status);
    const touchedAfterSeed = duration > MODIFIED_THRESHOLD_MS;

    if (isPurchased) {
      bucket.completed += 1;
    } else if (item.status === RegistryItemStatus.ADDED) {
      bucket.completed += 1;
    }

    if (isAcceptedStatus && !touchedAfterSeed) {
      accepted += 1;
    } else if (item.status === RegistryItemStatus.CONSIDERING) {
      deferred += 1;
    } else {
      modified += 1;
    }

    if (isPurchased) {
      confidencePurchases += 1;
      if (duration >= CONFIDENCE_WINDOW_MS) {
        confidenceStable += 1;
      }
    }
  });

  const activeRegistryRows = await prisma.registryItem.groupBy({
    by: ['registryId'],
    where: {
      registryId: { not: null },
      OR: [
        { updatedAt: { gte: rangeStart } },
        { createdAt: { gte: rangeStart } },
      ],
    },
  });

  const completionValues = Array.from(registryCompletion.values());
  const avgCompletionPct =
    completionValues.length === 0
      ? 0
      : completionValues.reduce((acc, entry) => acc + (entry.completed / entry.seeded) * 100, 0) /
        completionValues.length;

  const mentorFeedbackRows = seededItemIds.length
    ? await prisma.mentorFeedback.findMany({
        where: { registryItemId: { in: seededItemIds } },
        select: { registryItemId: true },
      })
    : [];

  const uniqueMentorItems = new Set(mentorFeedbackRows.map((row) => row.registryItemId));

  const registryKpis = {
    registriesSeeded: uniqueRegistryKeys.size,
    activeRegistries30d: activeRegistryRows.length,
    avgCompletionPct: Number(avgCompletionPct.toFixed(1)),
    acceptanceRate: formatPercent(accepted, seededItems.length),
    modificationRate: formatPercent(modified, seededItems.length),
    deferralRate: formatPercent(deferred, seededItems.length),
    avgDecisionsPerRegistry:
      uniqueRegistryKeys.size === 0 ? 0 : Number((seededItems.length / uniqueRegistryKeys.size).toFixed(1)),
    mentorInterventionRate:
      seededItems.length === 0
        ? 0
        : Number(((uniqueMentorItems.size / seededItems.length) * 100).toFixed(1)),
    purchaseConfidenceScore:
      confidencePurchases === 0 ? 0 : Number(((confidenceStable / confidencePurchases) * 100).toFixed(1)),
  };

  const categoryMap = new Map<
    string,
    { seeded: number; accepted: number; modified: number; deferred: number; timeSum: number; timeCount: number }
  >();

  seededItems.forEach((item) => {
    const category = item.category ?? item.section ?? 'Uncategorized';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, { seeded: 0, accepted: 0, modified: 0, deferred: 0, timeSum: 0, timeCount: 0 });
    }
    const entry = categoryMap.get(category)!;
    entry.seeded += 1;

    const durationMs = item.updatedAt.getTime() - item.createdAt.getTime();
    if (TIME_TRACKED_STATUSES.includes(item.status)) {
      entry.timeSum += durationMs;
      entry.timeCount += 1;
    }

    if (ACCEPTED_STATUSES.includes(item.status)) {
      entry.accepted += 1;
    } else if (item.status === RegistryItemStatus.CONSIDERING) {
      entry.deferred += 1;
    } else {
      entry.modified += 1;
    }
  });

  const byCategory = Array.from(categoryMap.entries()).map(([category, metrics]) => ({
    category,
    seededCount: metrics.seeded,
    accepted: metrics.accepted,
    modified: metrics.modified,
    deferred: metrics.deferred,
    avgTimeToDecisionHours:
      metrics.timeCount === 0 ? null : Number((metrics.timeSum / metrics.timeCount / 1000 / 60 / 60).toFixed(1)),
  }));

  const frictionMap = new Map<
    string,
    {
      registryId: string;
      memberId: string;
      memberName?: string | null;
      mentorId?: string | null;
      seeded: number;
      completed: number;
      pendingDecisions: number;
      deferrals: number;
      swaps: number;
      lastActivityAt: string | null;
    }
  >();

  const now = Date.now();
  seededItems.forEach((item) => {
    const registryId = item.registryId ?? `user-${item.userId}`;
    if (!frictionMap.has(registryId)) {
      frictionMap.set(registryId, {
        registryId,
        memberId: item.userId,
        memberName: item.user?.name ?? null,
        mentorId: item.user?.mentorId ?? null,
        seeded: 0,
        completed: 0,
        pendingDecisions: 0,
        deferrals: 0,
        swaps: 0,
        lastActivityAt: null,
      });
    }
    const entry = frictionMap.get(registryId)!;
    entry.seeded += 1;
    if (ACCEPTED_STATUSES.includes(item.status)) {
      entry.completed += 1;
    }
    if (item.status === RegistryItemStatus.CONSIDERING) {
      entry.deferrals += 1;
      if (now - item.createdAt.getTime() >= PENDING_DECISION_WINDOW_MS) {
        entry.pendingDecisions += 1;
      }
    }
    if (item.status === RegistryItemStatus.REMOVED) {
      entry.swaps += 1;
    }
    if (!entry.lastActivityAt || item.updatedAt.getTime() > new Date(entry.lastActivityAt).getTime()) {
      entry.lastActivityAt = item.updatedAt.toISOString();
    }
  });

  const highFrictionRegistries = Array.from(frictionMap.values())
    .map((entry) => {
      const flags: string[] = [];
      if (entry.pendingDecisions >= 3) {
        flags.push('Pending decisions > 7d');
      }
      if (entry.deferrals > 0) {
        flags.push('Deferrals detected');
      }
      if (entry.swaps > 0) {
        flags.push('Swapped / removed');
      }
      const completionPct = entry.seeded
        ? Number(((entry.completed / entry.seeded) * 100).toFixed(1))
        : 0;
      return {
        registryId: entry.registryId,
        memberId: entry.memberId,
        memberName: entry.memberName,
        completionPct,
        pendingDecisions: entry.pendingDecisions,
        deferrals: entry.deferrals,
        swaps: entry.swaps,
        lastActivityAt: entry.lastActivityAt,
        mentorId: entry.mentorId,
        flags,
      };
    })
    .sort((a, b) => {
      if (b.pendingDecisions !== a.pendingDecisions) {
        return b.pendingDecisions - a.pendingDecisions;
      }
      if (b.deferrals !== a.deferrals) {
        return b.deferrals - a.deferrals;
      }
      return a.completionPct - b.completionPct;
    })
    .slice(0, 5);

  const purchasedItems = await prisma.registryItem.findMany({
    where: {
      status: RegistryItemStatus.PURCHASED,
      updatedAt: { gte: rangeStart },
    },
    orderBy: { updatedAt: 'desc' },
    take: 60,
    include: {
      user: { select: USER_ANALYTICS_SELECT },
      registry: { select: REGISTRY_ANALYTICS_SELECT },
      affiliate: { select: AFFILIATE_ANALYTICS_SELECT },
      product: { select: PRODUCT_ANALYTICS_SELECT },
      blogInfluences: true,
    },
  }) as AnalyticsItem[];

  const purchasedItemIds = purchasedItems.map((item) => item.id);

  const purchasedMentorFeedbacks = purchasedItemIds.length
    ? await prisma.mentorFeedback.findMany({
        where: { registryItemId: { in: purchasedItemIds } },
        include: { mentor: { select: { id: true, name: true } } },
      })
    : [];

  const purchasedItemMap = new Map(purchasedItems.map((item) => [item.id, item]));

  const byNetwork = new Map<string, { estimated: number; confirmed: number; orders: number }>();
  const byBrand = new Map<string, { network: string; estimated: number; confirmed: number; orders: number }>();
  const byDecisionSource = new Map<AffiliateDecisionSource, { estimated: number; confirmed: number; orders: number }>();
  DECISION_SOURCES.forEach((source) => {
    byDecisionSource.set(source, { estimated: 0, confirmed: 0, orders: 0 });
  });

  let totalEstimatedCommission = 0;
  let totalOrderValue = 0;

  purchasedItems.forEach((item) => {
    const network = resolveNetwork(item);
    const source = resolveDecisionSource(item);
    const value = orderValue(item);
    const rate = commissionRateForNetwork(network);
    const estimated = value * rate;

    totalOrderValue += value;
    totalEstimatedCommission += estimated;

    const networkEntry = byNetwork.get(network) ?? { estimated: 0, confirmed: 0, orders: 0 };
    networkEntry.estimated += estimated;
    networkEntry.confirmed += estimated;
    networkEntry.orders += 1;
    byNetwork.set(network, networkEntry);

    const brand = item.brand ?? item.product?.brand ?? 'Unknown';
    const brandEntry = byBrand.get(brand) ?? { network, estimated: 0, confirmed: 0, orders: 0 };
    brandEntry.estimated += estimated;
    brandEntry.confirmed += estimated;
    brandEntry.orders += 1;
    byBrand.set(brand, brandEntry);

    const decisionEntry = byDecisionSource.get(source)!;
    decisionEntry.estimated += estimated;
    decisionEntry.confirmed += estimated;
    decisionEntry.orders += 1;
    byDecisionSource.set(source, decisionEntry);
  });

  const mentorEarningsMap = new Map<
    string,
    {
      mentorName?: string | null;
      estimated: number;
      confirmed: number;
      orders: number;
    }
  >();

  purchasedMentorFeedbacks.forEach((feedback) => {
    if (!feedback.registryItemId) return;
    const item = purchasedItemMap.get(feedback.registryItemId);
    if (!item || !feedback.mentorId) return;
    const network = resolveNetwork(item);
    const value = orderValue(item);
    const estimated = value * commissionRateForNetwork(network);

    const entry = mentorEarningsMap.get(feedback.mentorId) ?? { mentorName: feedback.mentor?.name ?? null, estimated: 0, confirmed: 0, orders: 0 };
    entry.estimated += estimated;
    entry.confirmed += estimated;
    entry.orders += 1;
    mentorEarningsMap.set(feedback.mentorId, entry);
  });

  const transactions = purchasedItems.map((item) => {
    const value = orderValue(item);
    const network = resolveNetwork(item);
    const rate = commissionRateForNetwork(network);
    return {
      date: item.updatedAt.toISOString(),
      memberId: item.userId,
      mentorId: item.user?.mentorId ?? null,
      registryItemId: item.id,
      brand: item.brand ?? item.product?.brand ?? null,
      merchant: item.merchant ?? null,
      network,
      orderValue: Number(value.toFixed(2)),
      commissionRate: Number(rate.toFixed(3)),
      estimatedCommission: Number((value * rate).toFixed(2)),
      confirmedCommission: Number((value * rate).toFixed(2)),
      status: 'approved' as const,
      clickRef: null,
      refId: null,
    };
  });

  const productRevenue = Number(totalOrderValue.toFixed(2));
  let leadRevenueEventCount = 0;
  try {
    const [leadEventRow] = (await prisma.$queryRaw<
      { count: number }[]
    >(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM "AffiliateEvent"
      WHERE "affiliateName" = ${MYREGISTRY_CANON.name}
        AND "eventType" = ${MYREGISTRY_SIGNUP_COMPLETED}
        AND "createdAt" >= ${rangeStart}
    `)) ?? [{ count: 0 }];
    leadRevenueEventCount = leadEventRow?.count ?? 0;
  } catch (error) {
    console.warn('admin analytics: unable to read affiliate events', error);
  }

  const leadRevenue = leadRevenueEventCount * MYREGISTRY_CANON.payoutValue;
  const revenueBreakdown = {
    productAffiliate: productRevenue,
    eventService: 0,
    lead: Number(leadRevenue.toFixed(2)),
  };

  const affiliateKpis = {
    estimatedCommission: Number(totalEstimatedCommission.toFixed(2)),
    confirmedCommission: Number(totalEstimatedCommission.toFixed(2)),
    pendingCommission: 0,
    avgCommissionPerRegistry:
      purchasedItems.length === 0 ? 0 : Number((totalEstimatedCommission / purchasedItems.length).toFixed(2)),
    revenueAttributed: productRevenue,
    revenueBreakdown,
  };

  const affiliatePayload = {
    kpis: affiliateKpis,
    byNetwork: Array.from(byNetwork.entries()).map(([network, summary]) => ({
      network,
      estimated: Number(summary.estimated.toFixed(2)),
      confirmed: Number(summary.confirmed.toFixed(2)),
      orders: summary.orders,
    })),
    byBrand: Array.from(byBrand.entries()).map(([brand, summary]) => ({
      brand,
      network: summary.network,
      estimated: Number(summary.estimated.toFixed(2)),
      confirmed: Number(summary.confirmed.toFixed(2)),
      orders: summary.orders,
    })),
    byDecisionSource: DECISION_SOURCES.map((source) => {
      const summary = byDecisionSource.get(source)!;
      return {
        decisionSource: source,
        estimated: Number(summary.estimated.toFixed(2)),
        confirmed: Number(summary.confirmed.toFixed(2)),
        orders: summary.orders,
      };
    }),
    mentorEarnings: Array.from(mentorEarningsMap.entries()).map(([mentorId, values]) => ({
      mentorId,
      mentorName: values.mentorName ?? undefined,
      estimated: Number(values.estimated.toFixed(2)),
      confirmed: Number(values.confirmed.toFixed(2)),
      orders: values.orders,
      conversionLift: null,
    })),
    transactions,
  };

  type InfluenceRow = {
    id: string;
    postSlug: string;
    createdAt: Date;
    registryItem: Prisma.RegistryItemGetPayload<{
      select: typeof BLOG_INFLUENCE_REGISTRY_ITEM_SELECT;
    }> | null;
  };

  let influenceRows: InfluenceRow[] = [];
  try {
    influenceRows = await prisma.registryItemBlogInfluence.findMany({
      where: {
        createdAt: { gte: rangeStart },
      },
      select: {
        id: true,
        postSlug: true,
        createdAt: true,
        registryItem: {
          select: BLOG_INFLUENCE_REGISTRY_ITEM_SELECT,
        },
      },
    });
  } catch (error) {
    console.warn("admin analytics: blog influence table unavailable", error);
    influenceRows = [];
  }

  const influencerRegistries = new Set<string>();
  const influenceBySlug = new Map<
    string,
    {
      influencedRegistries: Set<string>;
      acceptanceCount: number;
      purchaseCount: number;
      revenue: number;
      brands: Map<string, number>;
    }
  >();

  let influencedItemsTotal = 0;
  let influencedAcceptedTotal = 0;
  let influencedPurchasedTotal = 0;
  let influencedRevenueTotal = 0;

  influenceRows.forEach((influence) => {
    const slug = influence.postSlug;
    const target = influence.registryItem;
    if (!target) return;
    const registryKey = target.registryId ?? `user:${target.userId}`;
    influencerRegistries.add(registryKey);

    if (!influenceBySlug.has(slug)) {
      influenceBySlug.set(slug, {
        influencedRegistries: new Set(),
        acceptanceCount: 0,
        purchaseCount: 0,
        revenue: 0,
        brands: new Map(),
      });
    }

    const bucket = influenceBySlug.get(slug)!;
    bucket.influencedRegistries.add(registryKey);

    if (ACCEPTED_STATUSES.includes(target.status)) {
      bucket.acceptanceCount += 1;
      influencedAcceptedTotal += 1;
    }
    if (target.status === RegistryItemStatus.PURCHASED) {
      bucket.purchaseCount += 1;
      influencedPurchasedTotal += 1;
    }

    influencedItemsTotal += 1;
    const value = orderValue(target);
    bucket.revenue += value;
    influencedRevenueTotal += value;

    const brand = target.brand ?? target.product?.brand ?? 'Unknown';
    const brandRevenue = bucket.brands.get(brand) ?? 0;
    bucket.brands.set(brand, brandRevenue + value);
  });

  const baselineAcceptanceRate = formatPercent(accepted, seededItems.length);
  const baselinePurchaseRate = formatPercent(
    seededItems.filter((item) => item.status === RegistryItemStatus.PURCHASED).length,
    seededItems.length,
  );

  const contentPosts = Array.from(influenceBySlug.entries()).map(([slug, metrics]) => {
    const postTitle = blogMetaBySlug.get(slug);
    const totalInfluenced = metrics.influencedRegistries.size;
    const acceptancePct =
      metrics.acceptanceCount === 0 || totalInfluenced === 0
        ? 0
        : (metrics.acceptanceCount / totalInfluenced) * 100;
    const purchasePct =
      metrics.purchaseCount === 0 || totalInfluenced === 0
        ? 0
        : (metrics.purchaseCount / totalInfluenced) * 100;
    const acceptanceLift =
      baselineAcceptanceRate === 0 ? null : Number((acceptancePct - baselineAcceptanceRate).toFixed(1));
    const purchaseLift =
      baselinePurchaseRate === 0 ? null : Number((purchasePct - baselinePurchaseRate).toFixed(1));

    const topBrands = Array.from(metrics.brands.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([brand, revenue]) => ({ brand, revenue: Number(revenue.toFixed(2)) }));

    return {
      slug,
      title: postTitle,
      views: 0,
      influencedRegistries: totalInfluenced,
      acceptanceLiftPct: acceptanceLift,
      purchaseLiftPct: purchaseLift,
      influencedRevenue: Number(metrics.revenue.toFixed(2)),
      topBrands,
    };
  });

  const influencedAcceptanceRatePct = formatPercent(influencedAcceptedTotal, influencedItemsTotal);
  const influencedPurchaseRatePct = formatPercent(influencedPurchasedTotal, influencedItemsTotal);
  const contentPayload = {
    kpis: {
      totalViews: 0,
      blogToOnboardingConversionPct: registryKpis.registriesSeeded
        ? Number(((influencerRegistries.size / registryKpis.registriesSeeded) * 100).toFixed(1))
        : null,
      blogInfluencedRegistries: influencerRegistries.size,
      acceptanceLiftPct:
        baselineAcceptanceRate === 0
          ? null
          : Number((influencedAcceptanceRatePct - baselineAcceptanceRate).toFixed(1)),
      purchaseLiftPct:
        baselinePurchaseRate === 0
          ? null
          : Number((influencedPurchaseRatePct - baselinePurchaseRate).toFixed(1)),
      blogInfluencedRevenue: Number(influencedRevenueTotal.toFixed(2)),
    },
    byPost: contentPosts,
  };

  return {
    generatedAt: new Date().toISOString(),
    registry: {
      kpis: registryKpis,
      byCategory,
      highFrictionRegistries,
    },
    affiliate: affiliatePayload,
    content: contentPayload,
  };
};

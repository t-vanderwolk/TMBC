import { prisma } from "@/lib/prisma";
import { emitRegistryAnalytics } from "@/lib/services/server/analytics.service";

type PriceAlertType =
  | "favorable_price_detected"
  | "price_drop_after_purchase"
  | "price_adjustment_prompted";

export type PriceAlert = {
  registryItemId: string;
  productId: string;
  category: string;
  message: string;
  type: PriceAlertType;
  priceDelta: number;
  affiliatePartnerId: string | null;
};

const PRICE_SNAPSHOT_WINDOW_HOURS = 6;
const BASELINE_WINDOW_DAYS = 30;
const NOTIFY_COOLDOWN_HOURS = 24;

const isPriceFeedConfigured = () => Boolean(process.env.PRICE_INTELLIGENCE_ENABLED);

const normalizeCurrency = (value?: string | null) => value?.toUpperCase() || "USD";

const nowMinusHours = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);
const nowMinusDays = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const toRoundedDelta = (value: number) => Math.round(value * 100) / 100;

const computeBaselinePrice = (snapshots: { price: number }[]) => {
  if (!snapshots.length) return null;
  const sum = snapshots.reduce((total, snap) => total + snap.price, 0);
  return sum / snapshots.length;
};

const shouldNotify = (lastNotifiedAt: Date | null) => {
  if (!lastNotifiedAt) return true;
  return lastNotifiedAt < nowMinusHours(NOTIFY_COOLDOWN_HOURS);
};

type AffiliatePriceInfo = {
  price: number;
  currency?: string | null;
};

const fetchAffiliatePrice = async (_productId: string): Promise<AffiliatePriceInfo | null> => {
  // Advocacy-first: only use approved affiliate feeds (no scraping). Disabled by default.
  if (!isPriceFeedConfigured()) {
    return null;
  }

  // Placeholder for future approved feed integrations.
  return null;
};

const recordPriceSnapshot = async (productId: string, affiliatePartnerId: string | null, price: number) => {
  const cutoff = nowMinusHours(PRICE_SNAPSHOT_WINDOW_HOURS);
  const recent = await prisma.priceSnapshot.findFirst({
    where: {
      productId,
      affiliatePartnerId: affiliatePartnerId ?? undefined,
      capturedAt: { gte: cutoff },
    },
    select: { id: true },
  });

  if (recent) return;

  // Store numeric price snapshots only (no scraped HTML payloads).
  await prisma.priceSnapshot.create({
    data: {
      productId,
      affiliatePartnerId: affiliatePartnerId ?? undefined,
      price,
      currency: normalizeCurrency("USD"),
    },
  });
};

const evaluateSnapshots = async (watch: {
  registryItemId: string;
  purchaseRecordedAt: Date | null;
  lastNotifiedAt: Date | null;
  registryItem: {
    id: string;
    productId: string;
    category: string | null;
    decisionStatus: string | null;
  };
}) => {
  // Advisory only: price signals never mutate registry decisions.
  const productId = watch.registryItem.productId;
  const category = watch.registryItem.category ?? "general";

  const snapshots = await prisma.priceSnapshot.findMany({
    where: {
      productId,
      capturedAt: { gte: nowMinusDays(BASELINE_WINDOW_DAYS) },
    },
    orderBy: { capturedAt: "asc" },
  });

  if (snapshots.length < 2) return null;

  const latest = snapshots[snapshots.length - 1]!;
  const baselineSnapshots = snapshots.slice(0, -1);
  const baseline = computeBaselinePrice(baselineSnapshots);
  if (!baseline) return null;

  const delta = latest.price - baseline;
  const deltaPercent = delta / baseline;
  const priceDelta = toRoundedDelta(delta);
  const affiliatePartnerId = latest.affiliatePartnerId ?? null;

  if (watch.purchaseRecordedAt) {
    if (deltaPercent <= -0.05) {
      return {
        registryItemId: watch.registryItemId,
        productId,
        category,
        message:
          "Heads up: this item dipped since your purchase. You may be eligible for a price adjustment with the retailer.",
        type: "price_drop_after_purchase" as const,
        priceDelta,
        affiliatePartnerId,
      };
    }
    return null;
  }

  if (deltaPercent <= -0.08) {
    return {
      registryItemId: watch.registryItemId,
      productId,
      category,
      message:
        "A softer price just appeared for one of your accepted picks. If timing feels right, it may be worth a look.",
      type: "favorable_price_detected" as const,
      priceDelta,
      affiliatePartnerId,
    };
  }

  return null;
};

export const ensurePriceWatchForItem = async (registryItemId: string) => {
  const existing = await prisma.registryPriceWatch.findUnique({
    where: { registryItemId },
    select: { id: true },
  });

  if (existing) return;

  await prisma.registryPriceWatch.create({
    data: {
      registryItemId,
      watchStartedAt: new Date(),
    },
  });

  emitRegistryAnalytics("price_watch_started", {
    registryItemId,
  });
};

export const recordPurchaseForWatch = async (registryItemId: string) => {
  try {
    await prisma.registryPriceWatch.update({
      where: { registryItemId },
      data: { purchaseRecordedAt: new Date() },
    });
  } catch {
    // No watch created yet; ignore to avoid blocking registry updates.
  }
};

export const refreshPriceWatchesForUser = async (userId: string) => {
  // Price intelligence is advisory and only runs post-acceptance.
  const watches = await prisma.registryPriceWatch.findMany({
    where: {
      registryItem: {
        userId,
        decisionStatus: "ACCEPTED",
      },
    },
    include: {
      registryItem: true,
    },
  });

  if (!watches.length) return [];

  const alerts: PriceAlert[] = [];

  for (const watch of watches) {
    if (!shouldNotify(watch.lastNotifiedAt ?? null)) {
      continue;
    }

    const priceInfo: AffiliatePriceInfo | null = await fetchAffiliatePrice(
      watch.registryItem.productId,
    );
    if (priceInfo?.price) {
      await recordPriceSnapshot(watch.registryItem.productId, null, priceInfo.price);
    }

    const alert = await evaluateSnapshots({
      registryItemId: watch.registryItemId,
      purchaseRecordedAt: watch.purchaseRecordedAt,
      lastNotifiedAt: watch.lastNotifiedAt,
      registryItem: watch.registryItem,
    });

    if (!alert) {
      continue;
    }

    await prisma.registryPriceWatch.update({
      where: { registryItemId: watch.registryItemId },
      data: { lastNotifiedAt: new Date() },
    });

    emitRegistryAnalytics(alert.type, {
      registryItemId: alert.registryItemId,
      productId: alert.productId,
      category: alert.category,
      priceDelta: alert.priceDelta,
      affiliatePartnerId: alert.affiliatePartnerId,
    });

    if (alert.type === "price_drop_after_purchase") {
      emitRegistryAnalytics("price_adjustment_prompted", {
        registryItemId: alert.registryItemId,
        category: alert.category,
        priceDelta: alert.priceDelta,
        affiliatePartnerId: alert.affiliatePartnerId,
      });
    }

    alerts.push(alert);
  }

  return alerts;
};

export type AffiliateAnalyticsEvent = {
  affiliateId: string;
  affiliateName: string;
  network: "DIRECT" | "CJ" | "IMPACT" | "AWIN" | "MYREGISTRY" | "SHAREASALE";
  surface: "blog" | "registry" | "mentor";
  context?: string;
};

export function trackAffiliateResolution(event: AffiliateAnalyticsEvent) {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("affiliate:resolved", {
      detail: event,
    }),
  );
}

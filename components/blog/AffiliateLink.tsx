"use client";

import type { ReactNode } from "react";

import {
  AffiliateSurface,
  getAffiliateLink,
} from "@/lib/constants/affiliateCanon";
import { trackAffiliateResolution } from "@/lib/affiliate/affiliateAnalytics";

type AffiliateLinkProps = {
  affiliateId: string;
  destinationUrl: string;
  surface?: AffiliateSurface;
  context?: string;
  children: ReactNode;
  className?: string;
};

export function AffiliateLink({
  affiliateId,
  destinationUrl,
  surface = "blog",
  children,
  className = "",
  context,
}: AffiliateLinkProps) {
  const resolution = getAffiliateLink({
    affiliateId,
    destinationUrl,
    surface,
  });

  const shouldTrack = resolution.network !== "UNKNOWN";
  const handleClick = () => {
    if (!shouldTrack) {
      return;
    }

    trackAffiliateResolution({
      affiliateId: resolution.affiliateId,
      affiliateName: resolution.canonicalName ?? resolution.affiliateId,
      network: resolution.network,
      surface,
      context,
    });
  };

  return (
    <a
      href={resolution.href}
      target="_blank"
      rel="nofollow noopener sponsored"
      className={`text-foreground underline-offset-2 hover:underline ${className}`}
      aria-label={`Affiliate link to ${
        resolution.canonicalName ?? "partner"
      } (${resolution.status})`}
      data-affiliate-id={resolution.affiliateId}
      data-affiliate-name={resolution.canonicalName ?? resolution.affiliateId}
      data-affiliate-status={resolution.status}
      data-affiliate-network={resolution.network}
      data-affiliate-surface={resolution.surface}
      data-affiliate-priority={resolution.priorityTier}
      data-affiliate-context={context ?? ""}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

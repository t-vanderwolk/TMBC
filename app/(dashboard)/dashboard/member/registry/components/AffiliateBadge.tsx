"use client";

import { AffiliateNetwork } from '@prisma/client';

export type AffiliateBadgeProps = {
  partner: { id: string; name: string; network: AffiliateNetwork } | null;
};

const networkLabel = (network: AffiliateNetwork) => (network === AffiliateNetwork.AWIN ? 'AWIN' : 'Direct');

export default function AffiliateBadge({ partner }: AffiliateBadgeProps) {
  const label = partner
    ? `${partner.name} · ${networkLabel(partner.network)}`
    : 'MyRegistry · AWIN';

  return (
    <span className="rounded-full border border-[#F4E7EF] bg-[#FDF8FF] px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-[#7B4E62]">
      {label}
    </span>
  );
}

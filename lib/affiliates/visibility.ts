import type { AffiliatePartner } from "@prisma/client";

export type MentorAffiliateView = {
  id: string;
  name: string;
  network: AffiliatePartner["network"];
};

export function serializeAffiliateForMentor(
  partner: Pick<AffiliatePartner, "id" | "name" | "network"> | null,
): MentorAffiliateView | null {
  if (!partner) {
    return null;
  }
  return {
    id: partner.id,
    name: partner.name,
    network: partner.network,
  };
}

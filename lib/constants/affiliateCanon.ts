export type AffiliateType = "product" | "service" | "lead";

export type AffiliateCanonEntry = {
  name: string;
  network: string;
  merchantId: string;
  type: AffiliateType;
  payoutModel: string;
  payoutValue: number;
  attribution: string;
};

export const MYREGISTRY_SIGNUP_COMPLETED = "MYREGISTRY_SIGNUP_COMPLETED";

export const MYREGISTRY_CANON: AffiliateCanonEntry = {
  name: "MyRegistry",
  network: "AWIN",
  merchantId: "88335",
  type: "lead",
  payoutModel: "CPL",
  payoutValue: 1.5,
  attribution: "signup_only",
};

export const AFFILIATE_CANON: AffiliateCanonEntry[] = [MYREGISTRY_CANON];

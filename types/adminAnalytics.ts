export type RegistryCategorySummary = {
  category: string;
  seededCount: number;
  accepted: number;
  modified: number;
  deferred: number;
  avgTimeToDecisionHours: number | null;
};

export type HighFrictionRegistry = {
  registryId: string;
  memberId: string;
  memberName?: string | null;
  completionPct: number;
  pendingDecisions: number;
  deferrals: number;
  swaps: number;
  lastActivityAt: string | null;
  mentorId?: string | null;
  flags: string[];
};

export type AffiliateNetworkSummary = {
  network: string;
  estimated: number;
  confirmed: number;
  orders: number;
};

export type AffiliateBrandSummary = {
  brand: string;
  network: string;
  estimated: number;
  confirmed: number;
  orders: number;
};

export type AffiliateDecisionSource = 'seeded_onboarding' | 'seeded_modified' | 'mentor_suggested' | 'academy_driven' | 'blog_influenced';

export type AffiliateDecisionSummary = {
  decisionSource: AffiliateDecisionSource;
  estimated: number;
  confirmed: number;
  orders: number;
};

export type MentorEarnings = {
  mentorId: string;
  mentorName?: string | null;
  estimated: number;
  confirmed: number;
  orders: number;
  conversionLift?: number | null;
};

export type AffiliateTransaction = {
  date: string;
  memberId?: string;
  mentorId?: string | null;
  registryItemId?: string | null;
  brand?: string | null;
  merchant?: string | null;
  network?: string | null;
  orderValue?: number | null;
  commissionRate?: number | null;
  estimatedCommission?: number | null;
  confirmedCommission?: number | null;
  status: 'estimated' | 'pending' | 'approved' | 'paid' | 'rejected';
  clickRef?: string | null;
  refId?: string | null;
};

export type BlogPostInfluence = {
  slug: string;
  title?: string;
  views?: number;
  influencedRegistries: number;
  acceptanceLiftPct?: number | null;
  purchaseLiftPct?: number | null;
  influencedRevenue: number;
  topBrands: Array<{ brand: string; revenue: number }>;
};

export type ContentKpis = {
  totalViews: number;
  blogToOnboardingConversionPct: number | null;
  blogInfluencedRegistries: number;
  acceptanceLiftPct: number | null;
  purchaseLiftPct: number | null;
  blogInfluencedRevenue: number;
};

export type RegistryKpis = {
  registriesSeeded: number;
  activeRegistries30d: number;
  avgCompletionPct: number;
  acceptanceRate: number;
  modificationRate: number;
  deferralRate: number;
  avgDecisionsPerRegistry: number;
  mentorInterventionRate: number;
  purchaseConfidenceScore: number;
};

export type AffiliateKpis = {
  estimatedCommission: number;
  confirmedCommission: number;
  pendingCommission: number;
  avgCommissionPerRegistry: number;
  revenueAttributed: number;
  revenueBreakdown: {
    productAffiliate: number;
    eventService: number;
    lead: number;
  };
};

export type AdminAnalyticsPayload = {
  generatedAt: string;
  registry: {
    kpis: RegistryKpis;
    byCategory: RegistryCategorySummary[];
    highFrictionRegistries: HighFrictionRegistry[];
  };
  affiliate: {
    kpis: AffiliateKpis;
    byNetwork: AffiliateNetworkSummary[];
    byBrand: AffiliateBrandSummary[];
    byDecisionSource: AffiliateDecisionSummary[];
    mentorEarnings: MentorEarnings[];
    transactions: AffiliateTransaction[];
  };
  content: {
    kpis: ContentKpis;
    byPost: BlogPostInfluence[];
  };
};

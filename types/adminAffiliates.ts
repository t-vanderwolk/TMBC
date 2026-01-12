export type AffiliateNetwork = "CJ" | "IMPACT" | "AWIN" | "SHAREASALE" | "MYREGISTRY" | "DIRECT";
export type AffiliatePosition = "INLINE" | "CALLOUT" | "END_CARD";
export type AffiliatePartnerStatus = "ACTIVE" | "AT_RISK" | "PAUSED";
export type AffiliatePartnerRole = "Brand" | "Retailer" | "Infrastructure";
export type AffiliatePartnerUsage = "BLOG" | "REGISTRY" | "BOTH" | "NONE";

export type AffiliateVisibility = {
  blogEligible: boolean;
  registryEligible: boolean;
  mentorVisible: boolean;
};

export type AffiliateBlogSettings = {
  eligible: boolean;
  defaultCta: "Shop" | "Explore" | "Learn More";
  placement: "END_CARD";
  primaryEligible: boolean;
};

export type AffiliateRegistrySettings = {
  retailerTier?: "Tier-1" | "Tier-2";
  priority?: number;
  categoryExclusions: string[];
  fallbackToBrandDirect: boolean;
};

export type AffiliateIds = Partial<Record<AffiliateNetwork, string>>;

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
};

export type AdminAffiliatePartner = {
  id: string;
  name: string;
  network: AffiliateNetwork;
  status: AffiliatePartnerStatus;
  usage: AffiliatePartnerUsage;
  category: string | null;
  role: AffiliatePartnerRole;
  commissionRate: string | null;
  visibility: AffiliateVisibility;
  blogSettings: AffiliateBlogSettings;
  registrySettings: AffiliateRegistrySettings;
  affiliateIds: AffiliateIds;
  defaultLink: string | null;
  cookieWindow: number | null;
  internalNotes: string | null;
  lastClickAt: string | null;
  note: string | null;
  blogLinkCount: number;
  activeLinkCount: number;
  pausedLinkCount: number;
  clickCount: number;
  hasBlogLink: boolean;
  hasRegistryItem: boolean;
};

export type AdminBlogAffiliateLink = {
  id: string;
  blogPost: BlogPostSummary;
  partnerName: string;
  label: string;
  position: AffiliatePosition;
  isPrimary: boolean;
  status: AffiliatePartnerStatus;
  destinationUrl: string;
  clickCount: number;
  createdAt: string;
};

export type AdminBlogLinksPayload = {
  links: AdminBlogAffiliateLink[];
  posts: BlogPostSummary[];
  partners: { id: string; name: string }[];
};

export type AffiliateAnalyticsRow = {
  blogPostId: string;
  blogPostTitle: string;
  blogPostSlug: string;
  partnerName: string;
  totalClicks: number;
  lastClickedAt: string | null;
  clicksByDay: { date: string; count: number }[];
  clicksByWeek: { week: string; count: number }[];
};

export type AffiliateNetwork = "CJ" | "IMPACT" | "AWIN" | "SHAREASALE" | "MYREGISTRY" | "DIRECT";
export type AffiliatePosition = "INLINE" | "CALLOUT" | "END_CARD";
export type AffiliatePartnerStatus = "ACTIVE" | "PAUSED";
export type AffiliatePartnerUsage = "BLOG" | "REGISTRY" | "BOTH" | "NONE";

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
  lastClickAt: string | null;
  note: string | null;
  blogLinkCount: number;
  activeLinkCount: number;
  pausedLinkCount: number;
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

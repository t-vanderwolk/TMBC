export const appendQueryParams = (
  url: string,
  params: Record<string, string | undefined | null>,
) => {
  const query = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  if (!query) {
    return url;
  }

  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}${query}`;
};

type AffiliateInput = {
  url: string;
  merchant?: string | null;
};

const normalizeMerchant = (merchant?: string | null) =>
  (merchant || "").toLowerCase().replace(/\s+/g, "");

const hasParam = (url: string, param: string) =>
  url.toLowerCase().includes(`${param.toLowerCase()}=`);

export const buildAffiliateUrl = ({ url, merchant }: AffiliateInput) => {
  const normalized = normalizeMerchant(merchant);

  switch (normalized) {
    case "macrobaby":
      return hasParam(url, "ref") ? url : appendQueryParams(url, { ref: "tmbc" });
    case "albeebaby":
      return hasParam(url, "affid") ? url : appendQueryParams(url, { affid: "tmbc" });
    case "silvercross":
    case "silvercrossus":
    case "silvercrossusa":
      return hasParam(url, "clickref")
        ? url
        : appendQueryParams(url, { clickref: "tmbc" });
    case "cj":
    case "cjaffiliate":
      return hasParam(url, "sid") ? url : appendQueryParams(url, { sid: "tmbc" });
    case "awin":
      return hasParam(url, "clickref")
        ? url
        : appendQueryParams(url, { clickref: "tmbc" });
    default:
      return url;
  }
};

export type AffiliateLinkPayload = {
  url: string;
  merchant?: string | null;
};

export const buildAffiliateLink = (link: AffiliateLinkPayload) => {
  return buildAffiliateUrl({ url: link.url, merchant: link.merchant });
};

const METADATA_PREFIX = "__TMBC_AFFILIATE_METADATA__::";

export type AffiliateLinkStatus = "ACTIVE" | "PAUSED";

export type AffiliateLinkDestination = {
  url: string;
  status: AffiliateLinkStatus;
};

export const decodeAffiliateDestination = (raw: string | null | undefined): AffiliateLinkDestination | null => {
  if (!raw) return null;

  if (raw.startsWith(METADATA_PREFIX)) {
    try {
      const parsed = JSON.parse(raw.slice(METADATA_PREFIX.length));
      if (parsed && typeof parsed === "object") {
        const parsedRecord = parsed as Record<string, unknown>;
        const urlCandidate = parsedRecord.url;
        const url = typeof urlCandidate === "string" ? urlCandidate : "";
        const statusCandidate = parsedRecord.status;
        const status: AffiliateLinkStatus = statusCandidate === "PAUSED" ? "PAUSED" : "ACTIVE";
        return { url, status };
      }
    } catch {
      // fall through to treating raw string as a URL
    }
  }

  return { url: raw, status: "ACTIVE" };
};

export const encodeAffiliateDestination = ({ url, status }: AffiliateLinkDestination): string => {
  const safeUrl = typeof url === "string" ? url : "";
  return `${METADATA_PREFIX}${JSON.stringify({ url: safeUrl, status })}`;
};

export const ensureAffiliateDestination = (
  raw: string | null | undefined,
  fallbackUrl?: string,
): AffiliateLinkDestination | null => {
  const destination = decodeAffiliateDestination(raw);
  if (destination && destination.url) {
    return destination;
  }
  if (fallbackUrl) {
    return { url: fallbackUrl, status: "ACTIVE" };
  }
  return destination;
};

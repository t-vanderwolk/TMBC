import { Product } from '@prisma/client';

const appendQueryParams = (url: string, params: Record<string, string | undefined | null>) => {
  const query = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  if (!query) {
    return url;
  }

  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}${query}`;
};

type AffiliateInput = {
  url: string;
  merchant?: string | null;
  mentorRef?: string;
};

const normalizeMerchant = (merchant?: string | null) => (merchant || '').toLowerCase().replace(/\s+/g, '');
const hasParam = (url: string, param: string) => url.toLowerCase().includes(`${param.toLowerCase()}=`);

export const buildAffiliateUrl = ({ url, merchant, mentorRef }: AffiliateInput) => {
  const normalized = normalizeMerchant(merchant);
  const mentor = mentorRef?.trim() || undefined;

  switch (normalized) {
    case 'macrobaby':
      return hasParam(url, 'ref')
        ? appendQueryParams(url, { mentor })
        : appendQueryParams(url, { ref: 'tmbc', mentor });
    case 'albeebaby':
      return hasParam(url, 'affid')
        ? appendQueryParams(url, { mentor })
        : appendQueryParams(url, { affid: 'tmbc', mentor });
    case 'silvercross':
    case 'silvercrossus':
    case 'silvercrossusa':
      return hasParam(url, 'clickref')
        ? appendQueryParams(url, { mentor })
        : appendQueryParams(url, { clickref: mentor || 'tmbc' });
    case 'cj':
    case 'cjaffiliate':
      return hasParam(url, 'sid')
        ? appendQueryParams(url, { mentor })
        : appendQueryParams(url, { sid: mentor || 'tmbc' });
    case 'awin':
      return hasParam(url, 'clickref')
        ? appendQueryParams(url, { mentor })
        : appendQueryParams(url, { clickref: mentor || 'tmbc' });
    default:
      return mentor ? appendQueryParams(url, { mentor }) : url;
  }
};

export const buildAffiliateLink = (product: Pick<Product, 'affiliateUrl' | 'merchant'>, mentorRef?: string) => {
  return buildAffiliateUrl({ url: product.affiliateUrl, merchant: product.merchant, mentorRef });
};

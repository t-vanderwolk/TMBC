"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAffiliateLink = exports.buildAffiliateUrl = void 0;
const appendQueryParams = (url, params) => {
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
const normalizeMerchant = (merchant) => (merchant || '').toLowerCase().replace(/\s+/g, '');
const hasParam = (url, param) => url.toLowerCase().includes(`${param.toLowerCase()}=`);
const buildAffiliateUrl = ({ url, merchant, mentorRef }) => {
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
exports.buildAffiliateUrl = buildAffiliateUrl;
const buildAffiliateLink = (product, mentorRef) => {
    return (0, exports.buildAffiliateUrl)({ url: product.affiliateUrl, merchant: product.merchant, mentorRef });
};
exports.buildAffiliateLink = buildAffiliateLink;

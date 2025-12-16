import { AffiliateLink, Prisma, Product } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { buildAffiliateUrl } from './affiliate.service';

export type ProductResponse = {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  merchant: string;
  price: number | null;
};

type ProductWithLinks = Prisma.ProductGetPayload<{ include: { affiliateLinks: true } }>;

const getPrimaryAffiliateLink = (product: ProductWithLinks) =>
  product.affiliateLinks.find((link) => link.isPrimary) ?? product.affiliateLinks[0] ?? null;

const buildProductAffiliateUrl = (product: ProductWithLinks) => {
  const link = getPrimaryAffiliateLink(product);
  if (!link?.outboundUrl) {
    return 'https://taylor-madebaby.com';
  }
  return buildAffiliateUrl({ url: link.outboundUrl, merchant: link.retailerName });
};

const toProductResponse = (product: ProductWithLinks): ProductResponse => {
  const affiliateUrl = buildProductAffiliateUrl(product);
  const merchant = getPrimaryAffiliateLink(product)?.retailerName ?? product.brand ?? 'Taylor Made Baby';

  return {
    id: product.id,
    name: product.name,
    brand: product.brand ?? 'Taylor Made Baby',
    category: product.category,
    imageUrl: product.imageUrl ?? '',
    affiliateUrl,
    merchant,
    price: null,
  };
};

export const getProductsByCategories = async (categories: string[]) => {
  if (!categories.length) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      category: { in: categories },
    },
    include: { affiliateLinks: true },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products.map(toProductResponse);
};

export const getProductsByIds = async (ids: string[]) => {
  if (!ids.length) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: ids },
    },
    include: { affiliateLinks: true },
  });

  const productMap = new Map(products.map((product) => [product.id, toProductResponse(product)]));
  return ids.map((id) => productMap.get(id)).filter(Boolean) as ProductResponse[];
};

export const productToResponse = toProductResponse;

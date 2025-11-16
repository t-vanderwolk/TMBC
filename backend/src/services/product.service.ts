import { Product } from '@prisma/client';

import { prisma } from '../utils/prisma';

export type ProductResponse = {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  merchant: string;
  moduleCodes: string[];
  price: number | null;
  inStock: boolean;
};

const toProductResponse = (product: Product): ProductResponse => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  category: product.category,
  imageUrl: product.imageUrl,
  affiliateUrl: product.affiliateUrl,
  merchant: product.merchant,
  moduleCodes: product.moduleCodes,
  price: product.price ?? null,
  inStock: product.inStock,
});

export const getProductsByModuleCode = async (moduleCode: string) => {
  const products = await prisma.product.findMany({
    where: {
      moduleCodes: {
        has: moduleCode,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products.map(toProductResponse);
};

export const getProductsByCategories = async (categories: string[]) => {
  if (!categories.length) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      category: { in: categories },
    },
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
  });

  const productMap = new Map(products.map((product) => [product.id, toProductResponse(product)]));
  return ids.map((id) => productMap.get(id)).filter(Boolean) as ProductResponse[];
};

export const productToResponse = toProductResponse;

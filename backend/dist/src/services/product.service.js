"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productToResponse = exports.getProductsByIds = exports.getProductsByCategories = exports.getProductsByModuleCode = void 0;
const client_1 = require("../../prisma/client");
const toProductResponse = (product) => ({
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
const getProductsByModuleCode = async (moduleCode) => {
    const products = await client_1.prisma.product.findMany({
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
exports.getProductsByModuleCode = getProductsByModuleCode;
const getProductsByCategories = async (categories) => {
    if (!categories.length) {
        return [];
    }
    const products = await client_1.prisma.product.findMany({
        where: {
            category: { in: categories },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return products.map(toProductResponse);
};
exports.getProductsByCategories = getProductsByCategories;
const getProductsByIds = async (ids) => {
    if (!ids.length) {
        return [];
    }
    const products = await client_1.prisma.product.findMany({
        where: {
            id: { in: ids },
        },
    });
    const productMap = new Map(products.map((product) => [product.id, toProductResponse(product)]));
    return ids.map((id) => productMap.get(id)).filter(Boolean);
};
exports.getProductsByIds = getProductsByIds;
exports.productToResponse = toProductResponse;

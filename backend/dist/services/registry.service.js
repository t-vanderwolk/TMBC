"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMentorNotes = exports.createMentorNote = exports.removeRegistryItem = exports.updateRegistryItem = exports.addCustomItem = exports.addRegistryItem = exports.listRegistryItems = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const affiliate_service_1 = require("./affiliate.service");
const myRegistryLegacy_service_1 = require("./myRegistryLegacy.service");
const product_service_1 = require("./product.service");
const createProductPayload = (item) => {
    if (item.product) {
        return (0, product_service_1.productToResponse)(item.product);
    }
    return {
        id: `custom-${item.id}`,
        name: item.title,
        brand: item.merchant || 'Custom Item',
        category: item.category || 'custom',
        imageUrl: item.image || '',
        affiliateUrl: item.url,
        merchant: item.merchant || 'Custom',
        moduleCodes: item.moduleCode ? [item.moduleCode] : [],
        price: item.price ?? null,
        inStock: true,
    };
};
const formatItem = (item, mentorNotesLookup, mentorRef) => {
    const mentorNotes = item.productId ? mentorNotesLookup.get(item.productId) ?? [] : [];
    const merchant = item.merchant || item.product?.merchant;
    const affiliateUrl = mentorRef
        ? (0, affiliate_service_1.buildAffiliateUrl)({ url: item.url, merchant, mentorRef })
        : item.url;
    return {
        id: item.id,
        productId: item.productId ?? null,
        quantity: item.quantity,
        status: item.status,
        notes: item.notes,
        purchaseSource: item.purchaseSource,
        myRegistryId: item.myRegistryId,
        affiliateUrl,
        product: createProductPayload(item),
        mentorNotes,
        isCustom: item.isCustom,
    };
};
const hydrateMentorNotes = async (userId, productIds) => {
    const ids = productIds.filter((id) => Boolean(id));
    if (!ids.length) {
        return new Map();
    }
    const notes = await prisma_1.prisma.mentorNote.findMany({
        where: {
            memberId: userId,
            productId: { in: ids },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            mentor: { select: { id: true, name: true } },
        },
    });
    const grouped = new Map();
    for (const note of notes) {
        if (!grouped.has(note.productId)) {
            grouped.set(note.productId, []);
        }
        grouped.get(note.productId).push({
            id: note.id,
            note: note.note,
            mentorId: note.mentorId,
            mentorName: note.mentor.name || null,
            productId: note.productId,
            createdAt: note.createdAt.toISOString(),
        });
    }
    return grouped;
};
const listRegistryItems = async (userId, mentorRef) => {
    const items = await prisma_1.prisma.registryItem.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: 'asc' },
    });
    const mentorNotesLookup = await hydrateMentorNotes(userId, items.map((item) => item.productId ?? null));
    return items.map((item) => formatItem(item, mentorNotesLookup, mentorRef));
};
exports.listRegistryItems = listRegistryItems;
const syncMyRegistryAdd = async (userId, item) => {
    if (!(await (0, myRegistryLegacy_service_1.isConnected)(userId)))
        return null;
    try {
        const giftId = await (0, myRegistryLegacy_service_1.addGift)({
            userId,
            title: item.title,
            url: item.url,
            price: item.price ?? item.product?.price ?? null,
            image: item.image ?? item.product?.imageUrl ?? null,
        });
        if (giftId) {
            await prisma_1.prisma.registryItem.update({
                where: { id: item.id },
                data: { myRegistryId: giftId },
            });
            item.myRegistryId = giftId;
            return { success: true, operation: 'AddGift', data: { giftId } };
        }
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('MyRegistry add failed', error);
    }
    return null;
};
const addRegistryItem = async ({ userId, productId, quantity = 1, notes, status = client_1.RegistryStatus.NEEDED, mentorRef, }) => {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw new Error('Product not found');
    }
    const affiliateUrl = (0, affiliate_service_1.buildAffiliateUrl)({ url: product.affiliateUrl, merchant: product.merchant });
    const item = await prisma_1.prisma.registryItem.create({
        data: {
            userId,
            productId,
            isCustom: false,
            title: product.name,
            url: affiliateUrl,
            merchant: product.merchant,
            category: product.category,
            moduleCode: product.moduleCodes[0] ?? null,
            image: product.imageUrl,
            price: product.price,
            quantity,
            notes,
            status,
        },
        include: { product: true },
    });
    const myRegistryResponse = await syncMyRegistryAdd(userId, item);
    const mentorLookup = await hydrateMentorNotes(userId, [productId]);
    return {
        item: formatItem(item, mentorLookup, mentorRef),
        myRegistryResponse,
    };
};
exports.addRegistryItem = addRegistryItem;
const addCustomItem = async ({ userId, title, url, merchant, price, image, category, moduleCode, }) => {
    const affiliateUrl = (0, affiliate_service_1.buildAffiliateUrl)({ url, merchant });
    let myRegistryId = null;
    if (await (0, myRegistryLegacy_service_1.isConnected)(userId)) {
        try {
            const giftId = await (0, myRegistryLegacy_service_1.addGift)({
                userId,
                title,
                url: affiliateUrl,
                price: price ?? null,
                image: image ?? null,
            });
            myRegistryId = giftId;
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('MyRegistry custom add failed', error);
        }
    }
    const created = await prisma_1.prisma.registryItem.create({
        data: {
            userId,
            isCustom: true,
            title,
            url: affiliateUrl,
            merchant,
            category,
            moduleCode,
            image,
            price,
            status: client_1.RegistryStatus.ACTIVE,
            myRegistryId,
        },
        include: { product: true },
    });
    return formatItem(created, new Map(), undefined);
};
exports.addCustomItem = addCustomItem;
const updateRegistryItem = async ({ itemId, userId, quantity, notes, status, purchaseSource, mentorRef, }) => {
    const item = await prisma_1.prisma.registryItem.findFirst({
        where: { id: itemId, userId },
        include: { product: true },
    });
    if (!item) {
        throw new Error('Registry item not found');
    }
    const updated = await prisma_1.prisma.registryItem.update({
        where: { id: itemId },
        data: {
            quantity,
            notes,
            status,
            purchaseSource,
        },
        include: { product: true },
    });
    if (updated.myRegistryId && (await (0, myRegistryLegacy_service_1.isConnected)(userId))) {
        try {
            const affiliateUrl = updated.product
                ? (0, affiliate_service_1.buildAffiliateLink)(updated.product, mentorRef)
                : (0, affiliate_service_1.buildAffiliateUrl)({ url: updated.url, merchant: updated.merchant, mentorRef });
            await (0, myRegistryLegacy_service_1.updateMyRegistryGift)({
                giftId: updated.myRegistryId,
                quantity: updated.quantity,
                notes: updated.notes,
                affiliateUrl,
                status: updated.status,
            });
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('MyRegistry update failed', error);
        }
    }
    const mentorLookup = await hydrateMentorNotes(userId, [updated.productId ?? null]);
    return formatItem(updated, mentorLookup, mentorRef);
};
exports.updateRegistryItem = updateRegistryItem;
const removeRegistryItem = async (itemId, userId) => {
    const item = await prisma_1.prisma.registryItem.findFirst({
        where: { id: itemId, userId },
    });
    if (!item) {
        throw new Error('Registry item not found');
    }
    await prisma_1.prisma.registryItem.delete({ where: { id: itemId } });
    if (item.myRegistryId && (await (0, myRegistryLegacy_service_1.isConnected)(userId))) {
        try {
            await (0, myRegistryLegacy_service_1.removeMyRegistryGift)({ giftId: item.myRegistryId });
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('MyRegistry remove failed', error);
        }
    }
    return { success: true };
};
exports.removeRegistryItem = removeRegistryItem;
const createMentorNote = async ({ memberId, mentorId, productId, note }) => {
    const mentorNote = await prisma_1.prisma.mentorNote.create({
        data: {
            memberId,
            mentorId,
            productId,
            note,
        },
        include: {
            mentor: { select: { id: true, name: true } },
        },
    });
    return {
        id: mentorNote.id,
        memberId,
        mentorId,
        productId,
        note: mentorNote.note,
        mentorName: mentorNote.mentor.name || null,
        createdAt: mentorNote.createdAt.toISOString(),
    };
};
exports.createMentorNote = createMentorNote;
const listMentorNotes = async (memberId) => {
    const notes = await prisma_1.prisma.mentorNote.findMany({
        where: { memberId },
        orderBy: { createdAt: 'desc' },
        include: { mentor: { select: { id: true, name: true } }, product: true },
    });
    return notes.map((note) => ({
        id: note.id,
        note: note.note,
        mentorId: note.mentorId,
        mentorName: note.mentor.name || null,
        productId: note.productId,
        product: (0, product_service_1.productToResponse)(note.product),
        createdAt: note.createdAt.toISOString(),
    }));
};
exports.listMentorNotes = listMentorNotes;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRemoteValue = exports.markConflictResolved = exports.getConflictById = exports.listActiveConflicts = exports.clearConflict = exports.recordConflicts = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../utils/prisma");
const parseQuantity = (value) => {
    if (!value)
        return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};
const parseStatus = (value) => {
    if (!value)
        return undefined;
    const normalized = value.toUpperCase();
    const statuses = Object.values(client_1.RegistryStatus);
    return statuses.includes(normalized) ? normalized : undefined;
};
const normalizeValue = (value) => {
    if (value === undefined)
        return undefined;
    if (value === null)
        return null;
    return String(value);
};
const recordConflicts = async (conflicts) => {
    if (!conflicts.length)
        return;
    await Promise.all(conflicts.map(async (conflict) => {
        const normalizedLocal = normalizeValue(conflict.localValue);
        const normalizedRemote = normalizeValue(conflict.remoteValue);
        if (normalizedLocal === normalizedRemote) {
            await prisma_1.prisma.registryConflict.updateMany({
                where: {
                    userId: conflict.userId,
                    itemId: conflict.itemId,
                    field: conflict.field,
                    resolved: false,
                },
                data: { resolved: true },
            });
            return;
        }
        const existing = await prisma_1.prisma.registryConflict.findFirst({
            where: {
                userId: conflict.userId,
                itemId: conflict.itemId,
                field: conflict.field,
                resolved: false,
            },
        });
        if (existing) {
            await prisma_1.prisma.registryConflict.update({
                where: { id: existing.id },
                data: {
                    localValue: normalizedLocal ?? existing.localValue,
                    remoteValue: normalizedRemote ?? existing.remoteValue,
                    createdAt: new Date(),
                },
            });
            return;
        }
        await prisma_1.prisma.registryConflict.create({
            data: {
                userId: conflict.userId,
                itemId: conflict.itemId,
                field: conflict.field,
                localValue: normalizedLocal ?? null,
                remoteValue: normalizedRemote ?? null,
            },
        });
    }));
};
exports.recordConflicts = recordConflicts;
const clearConflict = async ({ userId, itemId, field }) => {
    await prisma_1.prisma.registryConflict.updateMany({
        where: { userId, itemId, field, resolved: false },
        data: { resolved: true },
    });
};
exports.clearConflict = clearConflict;
const listActiveConflicts = async (userId) => {
    return prisma_1.prisma.registryConflict.findMany({
        where: { userId, resolved: false },
        include: {
            item: {
                select: {
                    id: true,
                    title: true,
                    productId: true,
                    myRegistryId: true,
                    status: true,
                    url: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.listActiveConflicts = listActiveConflicts;
const getConflictById = async (conflictId, userId) => {
    return prisma_1.prisma.registryConflict.findFirst({
        where: { id: conflictId, userId },
        include: {
            item: {
                select: {
                    id: true,
                    title: true,
                    myRegistryId: true,
                    status: true,
                    quantity: true,
                    notes: true,
                    url: true,
                },
            },
        },
    });
};
exports.getConflictById = getConflictById;
const markConflictResolved = async (conflictId) => {
    await prisma_1.prisma.registryConflict.updateMany({
        where: { id: conflictId },
        data: { resolved: true },
    });
};
exports.markConflictResolved = markConflictResolved;
const buildUpdatePayload = (field, value) => {
    switch (field) {
        case 'quantity': {
            const quantity = parseQuantity(value ?? undefined);
            return typeof quantity === 'number' ? { quantity } : null;
        }
        case 'status': {
            const status = parseStatus(value ?? undefined);
            return status ? { status } : null;
        }
        case 'customNote':
            return { notes: value ?? null };
        case 'affiliateUrl':
            return { url: value ?? '' };
        default:
            return null;
    }
};
const applyRemoteValue = async (conflictId, userId) => {
    const conflict = await prisma_1.prisma.registryConflict.findFirst({
        where: { id: conflictId, userId, resolved: false },
    });
    if (!conflict) {
        throw new Error('Conflict not found');
    }
    const data = buildUpdatePayload(conflict.field, conflict.remoteValue ?? null);
    if (!data) {
        await (0, exports.markConflictResolved)(conflictId);
        return null;
    }
    const updated = await prisma_1.prisma.registryItem.update({
        where: { id: conflict.itemId },
        data,
        include: { product: true },
    });
    await (0, exports.markConflictResolved)(conflictId);
    return updated;
};
exports.applyRemoteValue = applyRemoteValue;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRegistryConflictController = exports.getRegistryConflictsController = exports.getMentorNotesController = exports.postMentorNoteController = exports.addCustomItemController = exports.deleteRegistryItem = exports.updateRegistryItemController = exports.bulkAddRegistryItemsController = exports.postRegistryItem = exports.getRegistryList = void 0;
const client_1 = require("@prisma/client");
const registry_service_1 = require("../services/registry.service");
const conflict_service_1 = require("../services/conflict.service");
const myRegistryLegacy_service_1 = require("../services/myRegistryLegacy.service");
const getUserId = (req) => req.user?.userId;
const parseStatus = (value) => {
    if (!value || typeof value !== 'string')
        return undefined;
    const normalized = value.toUpperCase();
    const statuses = Object.values(client_1.RegistryStatus);
    return statuses.includes(normalized) ? normalized : undefined;
};
const normalizeMerchantName = (merchant) => {
    if (!merchant)
        return undefined;
    const trimmed = merchant.trim();
    if (!trimmed)
        return undefined;
    const key = trimmed.toLowerCase();
    const lookup = {
        macrobaby: 'MacroBaby',
        'macro baby': 'MacroBaby',
        albeebaby: 'AlbeeBaby',
        'albee baby': 'AlbeeBaby',
        amazon: 'Amazon',
        'silver cross': 'Silver Cross',
        silvercross: 'Silver Cross',
    };
    return lookup[key] || trimmed;
};
const toNumberOrUndefined = (value) => {
    if (value === undefined || value === null || value === '')
        return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};
const getRegistryList = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const mentorRef = typeof req.query.mentorRef === 'string' ? req.query.mentorRef : undefined;
    const items = await (0, registry_service_1.listRegistryItems)(userId, mentorRef);
    res.json(items);
};
exports.getRegistryList = getRegistryList;
const postRegistryItem = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { productId, quantity, notes, status, mentorRef } = req.body;
    if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
    }
    try {
        const payloadStatus = parseStatus(status);
        const result = await (0, registry_service_1.addRegistryItem)({
            userId,
            productId,
            quantity,
            notes,
            status: payloadStatus ?? client_1.RegistryStatus.NEEDED,
            mentorRef,
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error?.message || 'Unable to add registry item' });
    }
};
exports.postRegistryItem = postRegistryItem;
const bulkAddRegistryItemsController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const productIds = Array.isArray(req.body?.productIds) ? req.body.productIds : [];
    if (!productIds.length) {
        return res.status(400).json({ error: 'productIds array is required' });
    }
    const items = [];
    for (const productId of productIds) {
        try {
            const result = await (0, registry_service_1.addRegistryItem)({
                userId,
                productId: String(productId),
                status: client_1.RegistryStatus.NEEDED,
            });
            if (result.item) {
                items.push(result.item);
            }
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('Bulk add item failed', error);
        }
    }
    res.status(201).json({ ok: true, items });
};
exports.bulkAddRegistryItemsController = bulkAddRegistryItemsController;
const updateRegistryItemController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { itemId, quantity, notes, status, purchaseSource, mentorRef } = req.body;
    if (!itemId) {
        return res.status(400).json({ error: 'itemId is required' });
    }
    try {
        const payloadStatus = parseStatus(status);
        const item = await (0, registry_service_1.updateRegistryItem)({
            itemId,
            userId,
            quantity,
            notes,
            status: payloadStatus,
            purchaseSource,
            mentorRef,
        });
        res.json(item);
    }
    catch (error) {
        res.status(400).json({ error: error?.message || 'Unable to update registry item' });
    }
};
exports.updateRegistryItemController = updateRegistryItemController;
const deleteRegistryItem = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const itemId = req.body?.itemId || req.params.id;
    if (!itemId) {
        return res.status(400).json({ error: 'itemId is required' });
    }
    try {
        const result = await (0, registry_service_1.removeRegistryItem)(itemId, userId);
        res.json(result);
    }
    catch (error) {
        res.status(404).json({ error: error?.message || 'Item not found' });
    }
};
exports.deleteRegistryItem = deleteRegistryItem;
const addCustomItemController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { title, url, merchant, price, image, category, moduleCode } = req.body;
    if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required' });
    }
    try {
        const item = await (0, registry_service_1.addCustomItem)({
            userId,
            title: String(title).trim(),
            url: String(url).trim(),
            merchant: normalizeMerchantName(merchant),
            price: toNumberOrUndefined(price),
            image: image ? String(image).trim() : undefined,
            category: category ? String(category).trim() : undefined,
            moduleCode: moduleCode ? String(moduleCode).trim() : undefined,
        });
        res.status(201).json(item);
    }
    catch (error) {
        res.status(400).json({ error: error?.message || 'Unable to add custom item' });
    }
};
exports.addCustomItemController = addCustomItemController;
const postMentorNoteController = async (req, res) => {
    const mentorId = getUserId(req);
    if (!mentorId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { memberId, note } = req.body;
    const { productId } = req.params;
    if (!memberId || !productId || !note) {
        return res.status(400).json({ error: 'memberId, productId, and note are required' });
    }
    try {
        const mentorNote = await (0, registry_service_1.createMentorNote)({
            mentorId,
            memberId,
            productId,
            note,
        });
        res.status(201).json(mentorNote);
    }
    catch (error) {
        res.status(400).json({ error: error?.message || 'Unable to add mentor note' });
    }
};
exports.postMentorNoteController = postMentorNoteController;
const getMentorNotesController = async (req, res) => {
    const { memberId } = req.params;
    if (!memberId) {
        return res.status(400).json({ error: 'memberId is required' });
    }
    const notes = await (0, registry_service_1.listMentorNotes)(memberId);
    res.json(notes);
};
exports.getMentorNotesController = getMentorNotesController;
const getRegistryConflictsController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const conflicts = await (0, conflict_service_1.listActiveConflicts)(userId);
    res.json({ ok: true, conflicts });
};
exports.getRegistryConflictsController = getRegistryConflictsController;
const buildRemotePayload = (field, value) => {
    switch (field) {
        case 'quantity':
            return { quantity: value ? Number(value) : undefined };
        case 'status':
            return { status: value ?? undefined };
        case 'customNote':
            return { notes: value ?? null };
        case 'affiliateUrl':
            return { affiliateUrl: value ?? undefined };
        default:
            return {};
    }
};
const resolveRegistryConflictController = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { conflictId, resolution } = req.body ?? {};
    if (!conflictId || !resolution) {
        return res.status(400).json({ error: 'conflictId and resolution are required' });
    }
    const conflict = await (0, conflict_service_1.getConflictById)(conflictId, userId);
    if (!conflict) {
        return res.status(404).json({ error: 'Conflict not found' });
    }
    try {
        if (resolution === 'remote') {
            await (0, conflict_service_1.applyRemoteValue)(conflictId, userId);
        }
        else if (resolution === 'local') {
            if (!conflict.item.myRegistryId) {
                throw new Error('Item is not connected to MyRegistry.');
            }
            const payload = buildRemotePayload(conflict.field, conflict.localValue);
            await (0, myRegistryLegacy_service_1.updateMyRegistryGift)({
                giftId: conflict.item.myRegistryId,
                ...payload,
            });
            await (0, conflict_service_1.markConflictResolved)(conflictId);
        }
        else {
            return res.status(400).json({ error: 'Invalid resolution option' });
        }
        const conflicts = await (0, conflict_service_1.listActiveConflicts)(userId);
        res.json({ ok: true, conflicts });
    }
    catch (error) {
        res.status(400).json({ error: error?.message || 'Unable to resolve conflict' });
    }
};
exports.resolveRegistryConflictController = resolveRegistryConflictController;

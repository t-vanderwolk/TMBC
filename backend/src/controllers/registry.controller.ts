import { Request, Response } from 'express';

import { RegistryStatus } from '@prisma/client';

import {
  addCustomItem,
  addRegistryItem,
  createMentorNote,
  listMentorNotes,
  listRegistryItems,
  removeRegistryItem,
  updateRegistryItem,
} from '../services/registry.service';

const getUserId = (req: Request) => (req as any).user?.userId as string | undefined;
const parseStatus = (value?: string) => {
  if (!value || typeof value !== 'string') return undefined;
  const normalized = value.toUpperCase();
  const statuses = Object.values(RegistryStatus);
  return statuses.includes(normalized as RegistryStatus) ? (normalized as RegistryStatus) : undefined;
};

const normalizeMerchantName = (merchant?: string) => {
  if (!merchant) return undefined;
  const trimmed = merchant.trim();
  if (!trimmed) return undefined;

  const key = trimmed.toLowerCase();
  const lookup: Record<string, string> = {
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

const toNumberOrUndefined = (value: unknown) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const getRegistryList = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const mentorRef = typeof req.query.mentorRef === 'string' ? req.query.mentorRef : undefined;
  const items = await listRegistryItems(userId, mentorRef);
  res.json(items);
};

export const postRegistryItem = async (req: Request, res: Response) => {
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
    const result = await addRegistryItem({
      userId,
      productId,
      quantity,
      notes,
      status: payloadStatus ?? RegistryStatus.NEEDED,
      mentorRef,
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Unable to add registry item' });
  }
};

export const updateRegistryItemController = async (req: Request, res: Response) => {
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

    const item = await updateRegistryItem({
      itemId,
      userId,
      quantity,
      notes,
      status: payloadStatus,
      purchaseSource,
      mentorRef,
    });

    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Unable to update registry item' });
  }
};

export const deleteRegistryItem = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const itemId = req.body?.itemId || req.params.id;
  if (!itemId) {
    return res.status(400).json({ error: 'itemId is required' });
  }

  try {
    const result = await removeRegistryItem(itemId, userId);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error?.message || 'Item not found' });
  }
};

export const addCustomItemController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, url, merchant, price, image, category, moduleCode } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  try {
    const item = await addCustomItem({
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
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Unable to add custom item' });
  }
};

export const postMentorNoteController = async (req: Request, res: Response) => {
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
    const mentorNote = await createMentorNote({
      mentorId,
      memberId,
      productId,
      note,
    });

    res.status(201).json(mentorNote);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Unable to add mentor note' });
  }
};

export const getMentorNotesController = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  if (!memberId) {
    return res.status(400).json({ error: 'memberId is required' });
  }

  const notes = await listMentorNotes(memberId);
  res.json(notes);
};

import { Request, Response } from 'express';

import {
  addGiftToMyRegistry,
  createMyRegistryUser,
  listMyRegistryGifts,
  removeMyRegistryGift,
  syncDown,
  syncUp,
  updateMyRegistryGift,
} from '../services/myRegistry.service';
import { listRegistryItems } from '../services/registry.service';
import { listActiveConflicts } from '../services/conflict.service';
import { prisma } from '../utils/prisma';

const getUserId = (req: Request) => (req as any).user?.userId as string | undefined;

const safeFallback = async (userId: string) => {
  try {
    return await listRegistryItems(userId);
  } catch {
    return [];
  }
};

const respond = async (res: Response, action: () => Promise<any>) => {
  try {
    const data = await action();
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'MyRegistry request failed' });
  }
};

export const createMyRegistryUserController = (req: Request, res: Response) => {
  return respond(res, () => createMyRegistryUser(req.body));
};

export const addMyRegistryGiftController = (req: Request, res: Response) => {
  return respond(res, () => addGiftToMyRegistry(req.body));
};

export const updateMyRegistryGiftController = (req: Request, res: Response) => {
  return respond(res, () => updateMyRegistryGift(req.body));
};

export const removeMyRegistryGiftController = (req: Request, res: Response) => {
  return respond(res, () => removeMyRegistryGift(req.body));
};

export const listMyRegistryGiftsController = (req: Request, res: Response) => {
  const memberExternalId =
    typeof req.query.memberExternalId === 'string' ? req.query.memberExternalId : req.body?.memberExternalId;

  if (!memberExternalId) {
    return res.status(400).json({ error: 'memberExternalId is required' });
  }

  return respond(res, () => listMyRegistryGifts({ memberExternalId }));
};

export const syncDownController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ ok: false, error: 'Unauthorized', fallbackItems: [] });
  }

  const result = await syncDown(userId);
  if (!result.ok) {
    const fallbackItems = await safeFallback(userId);
    return res.status(200).json({
      ok: false,
      error: result.error,
      fallbackItems,
    });
  }

  const items = await listRegistryItems(userId);
  res.json({
    ok: true,
    items,
    conflicts: result.conflicts,
    lastSyncedAt: result.lastSync.toISOString(),
  });
};

export const syncUpController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ ok: false, error: 'Unauthorized', fallbackItems: [] });
  }

  const result = await syncUp(userId);
  if (!result.ok) {
    const fallbackItems = await safeFallback(userId);
    return res.status(200).json({
      ok: false,
      error: result.error,
      fallbackItems,
    });
  }

  const items = await listRegistryItems(userId);
  res.json({
    ok: true,
    items,
    conflicts: result.conflicts,
    lastSyncedAt: result.lastSync.toISOString(),
  });
};

export const getSyncStatusController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { myRegistryLastSyncedAt: true },
  });
  const conflicts = await listActiveConflicts(userId);

  res.json({
    ok: true,
    lastSyncedAt: user?.myRegistryLastSyncedAt?.toISOString() ?? null,
    conflicts,
  });
};

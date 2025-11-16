import { Request, Response } from 'express';

import {
  addGiftToMyRegistry,
  createMyRegistryUser,
  listMyRegistryGifts,
  removeMyRegistryGift,
  updateMyRegistryGift,
} from '../services/myRegistry.service';

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

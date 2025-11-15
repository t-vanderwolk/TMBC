import { Request, Response } from 'express';

import {
  addRegistryItem,
  listRegistryItems,
  listRegistryRecommendations,
  removeRegistryItem,
} from '../services/registry.service';

export const getRegistryList = async (_req: Request, res: Response) => {
  const items = await listRegistryItems();
  res.json(items);
};

export const getRegistryRecommendations = async (_req: Request, res: Response) => {
  const recs = await listRegistryRecommendations();
  res.json(recs);
};

export const postRegistryItem = async (req: Request, res: Response) => {
  const { name, brand } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const item = await addRegistryItem({ name, brand });
  res.status(201).json(item);
};

export const deleteRegistryItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await removeRegistryItem(id);
  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
};

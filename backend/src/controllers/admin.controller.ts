import { Request, Response } from 'express';

import {
  approveWaitlistEntry,
  getAdminAnalytics,
  getAdminWaitlistEntries,
  rejectWaitlistEntry,
} from '../services/admin.service';

export const getAdminAnalyticsController = async (_req: Request, res: Response) => {
  const data = await getAdminAnalytics();
  res.json(data);
};

export const getAdminWaitlistController = async (_req: Request, res: Response) => {
  const entries = await getAdminWaitlistEntries();
  res.json(entries);
};

export const approveAdminWaitlistController = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }
  const entry = await approveWaitlistEntry(id);
  res.json(entry);
};

export const rejectAdminWaitlistController = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }
  const entry = await rejectWaitlistEntry(id);
  res.json(entry);
};

import { Request, Response } from 'express';

import { getRegistryPicks } from '../services/registry.service';

export const getRegistryDashboard = async (_req: Request, res: Response) => {
  const picks = await getRegistryPicks();
  res.json({ status: 'ok', picks });
};

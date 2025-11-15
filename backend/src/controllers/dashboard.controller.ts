import { Request, Response } from 'express';

import { getDashboardOverview } from '../services/dashboard.service';

export const getDashboardOverviewController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const overview = await getDashboardOverview(user?.firstName || user?.name);
  res.json(overview);
};

import { Request, Response } from 'express';

import {
  getDashboardOverview,
  getDashboardData,
} from '../services/dashboard.service';

export const getDashboardController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const data = await getDashboardData({
    id: user?.id,
    name: user?.name,
    firstName: user?.firstName,
  });
  res.json(data);
};

export const getDashboardOverviewController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const overview = await getDashboardOverview({
    id: user?.id,
    name: user?.name,
    firstName: user?.firstName,
  });
  res.json(overview);
};

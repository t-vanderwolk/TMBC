import { Request, Response } from 'express';

import { getAdminDashboard } from '../services/admin.service';

export const getAdminDashboardController = async (_req: Request, res: Response) => {
  const data = await getAdminDashboard();
  res.json({ status: 'ok', ...data });
};

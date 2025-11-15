import { Request, Response } from 'express';

import { getCommunityEvents } from '../services/community.service';

export const getCommunityDashboard = async (_req: Request, res: Response) => {
  const events = await getCommunityEvents();
  res.json({ status: 'ok', events });
};

import { Request, Response } from 'express';

import { getMentorSummaries } from '../services/mentor.service';

export const getMentorDashboard = async (_req: Request, res: Response) => {
  const mentors = await getMentorSummaries();
  res.json({ status: 'ok', mentors });
};

import { Request, Response } from 'express';

import {
  getMentorMentees,
  getMentorOverview,
  getMentorSummaries,
} from '../services/mentor.service';

export const getMentorDashboard = async (_req: Request, res: Response) => {
  const mentors = await getMentorSummaries();
  res.json({ status: 'ok', mentors });
};

export const getMentorOverviewController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const data = await getMentorOverview(mentor?.id || 'mentor');
  res.json(data);
};

export const getMentorMenteesController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const mentees = await getMentorMentees(mentor?.id || 'mentor');
  res.json(mentees);
};

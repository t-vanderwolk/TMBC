import { Request, Response } from 'express';

import { getAcademyLessons } from '../services/academy.service';

export const getAcademyDashboard = async (_req: Request, res: Response) => {
  const lessons = await getAcademyLessons();
  res.json({ status: 'ok', lessons });
};

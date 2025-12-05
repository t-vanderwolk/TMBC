import { Request, Response } from 'express';

import {
  getMentorJournalNeeds,
  getMentorMentees,
  getMentorOverview,
  getMentorSummaries,
  getMentorTasks,
  getMentorUpcomingEvents,
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

export const getMentorTasksController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const tasks = await getMentorTasks(mentor?.id || 'mentor');
  res.json(tasks);
};

export const getMentorJournalNeedsController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const journals = await getMentorJournalNeeds(mentor?.id || 'mentor');
  res.json(journals);
};

export const getMentorUpcomingEventsController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const events = await getMentorUpcomingEvents(mentor?.id || 'mentor');
  res.json(events);
};

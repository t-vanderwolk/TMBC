import { Request, Response } from 'express';

import {
  getMentorJournalNeeds,
  getMentorMemberOverview,
  getMentorMentees,
  getMentorNotes,
  getMentorOverview,
  getMentorSummaries,
  getMentorTasks,
  getMentorUpcomingEvents,
} from '../services/mentor.service';
import { createMentorNote, listMentorNotes } from '../services/registry.service';

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

export const getMentorEventsController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const events = await getMentorUpcomingEvents(mentor?.id || 'mentor');
  res.json(events);
};

export const getMentorNotesController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const notes = await getMentorNotes(mentor?.id || 'mentor');
  res.json(notes);
};

export const getMentorMemberOverviewController = async (req: Request, res: Response) => {
  const mentor = (req as any).user;
  const memberId = req.params.id;

  if (!memberId) {
    return res.status(400).json({ error: 'memberId is required' });
  }

  const overview = await getMentorMemberOverview(mentor?.id || 'mentor', memberId);
  res.json(overview);
};

export const getMentorNotesForMemberController = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  if (!memberId) {
    return res.status(400).json({ error: 'memberId is required' });
  }

  const notes = await listMentorNotes(memberId);
  res.json(notes);
};

export const postMentorNoteForMemberController = async (req: Request, res: Response) => {
  const mentorId = (req as any).user?.id;
  const { memberId, productId, note } = req.body || {};

  if (!mentorId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!memberId || !note) {
    return res.status(400).json({ error: 'memberId and note are required' });
  }

  try {
    const created = await createMentorNote({
      mentorId,
      memberId,
      productId,
      note,
    });
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Unable to save note' });
  }
};

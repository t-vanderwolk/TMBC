import { Request, Response } from 'express';

import {
  addMentorFeedback,
  completeTask,
  createTask,
  getFeedbackForMember,
  getMemberProfileForMentor,
  getMenteeList,
  getMentorOverview,
  getSharedJournalEntries,
  getTasksForMember,
  getTasksForMentor,
  shareJournalEntry,
} from '../services/mentorCollab.service';

const getUser = (req: Request) => (req as any).user || {};

export const getMentorOverviewController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const mentorId = user?.userId;
  if (!mentorId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const result = await getMentorOverview(mentorId);
  return res.status(result.ok ? 200 : 400).json(result);
};

export const getMenteeListController = async (req: Request, res: Response) => {
  const mentorId = getUser(req)?.userId;
  if (!mentorId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const result = await getMenteeList(mentorId);
  return res.status(result.ok ? 200 : 400).json(result);
};

export const getMemberProfileController = async (req: Request, res: Response) => {
  const mentorId = getUser(req)?.userId;
  if (!mentorId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const result = await getMemberProfileForMentor(mentorId, id);
  return res.status(result.ok ? 200 : 404).json(result);
};

export const postMentorFeedbackController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const { memberId, moduleId, registryItemId, message, mentorId: overrideMentorId } = req.body || {};
  const resolvedMentorId = user.role === 'mentor' ? user.userId : overrideMentorId;
  const resolvedMemberId = user.role === 'member' ? user.userId : memberId;

  if (!resolvedMentorId || !resolvedMemberId || !message) {
    return res.status(400).json({ error: 'mentorId, memberId, and message are required' });
  }

  const result = await addMentorFeedback({
    mentorId: resolvedMentorId,
    memberId: resolvedMemberId,
    moduleId,
    registryItemId,
    message,
  });

  return res.status(result.ok ? 201 : 400).json(result);
};

export const getMemberFeedbackController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const { memberId } = req.params;
  const registryItemId = typeof req.query.registryItemId === 'string' ? req.query.registryItemId : undefined;
  const moduleId = typeof req.query.moduleId === 'string' ? req.query.moduleId : undefined;

  if (user.role !== 'mentor' && user.userId !== memberId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const result = await getFeedbackForMember(memberId, registryItemId, moduleId);
  return res.status(result.ok ? 200 : 400).json(result);
};

export const postMentorTaskController = async (req: Request, res: Response) => {
  const mentorId = getUser(req)?.userId;
  if (!mentorId) return res.status(401).json({ error: 'Unauthorized' });
  const { memberId, type, referenceId, title, description } = req.body || {};
  if (!memberId || !type || !title) {
    return res.status(400).json({ error: 'memberId, type, and title are required' });
  }

  const result = await createTask({ mentorId, memberId, type, referenceId, title, description });
  return res.status(result.ok ? 201 : 400).json(result);
};

export const completeMentorTaskController = async (req: Request, res: Response) => {
  const mentorId = getUser(req)?.userId;
  if (!mentorId) return res.status(401).json({ error: 'Unauthorized' });
  const { taskId } = req.params;
  if (!taskId) return res.status(400).json({ error: 'taskId is required' });

  const result = await completeTask(taskId);
  return res.status(result.ok ? 200 : 400).json(result);
};

export const getMentorTasksController = async (req: Request, res: Response) => {
  const mentorId = getUser(req)?.userId;
  if (!mentorId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const result = await getTasksForMentor(mentorId);
  return res.status(result.ok ? 200 : 400).json(result);
};

export const getMemberTasksController = async (req: Request, res: Response) => {
  const memberId = getUser(req)?.userId;
  if (!memberId) return res.status(401).json({ error: 'Unauthorized' });

  const result = await getTasksForMember(memberId);
  return res.status(result.ok ? 200 : 400).json(result);
};

export const shareJournalEntryController = async (req: Request, res: Response) => {
  const memberId = getUser(req)?.userId;
  if (!memberId) return res.status(401).json({ error: 'Unauthorized' });
  const { journalId, mentorId, allowed } = req.body || {};
  if (!journalId || !mentorId) {
    return res.status(400).json({ error: 'journalId and mentorId are required' });
  }

  const result = await shareJournalEntry({ journalId, mentorId, memberId, allowed });
  return res.status(result.ok ? 200 : 400).json(result);
};

export const getSharedJournalEntriesController = async (req: Request, res: Response) => {
  const mentorId = getUser(req)?.userId;
  if (!mentorId) return res.status(401).json({ error: 'Unauthorized' });
  const { memberId } = req.params;

  const result = await getSharedJournalEntries(mentorId, memberId);
  return res.status(result.ok ? 200 : 400).json(result);
};

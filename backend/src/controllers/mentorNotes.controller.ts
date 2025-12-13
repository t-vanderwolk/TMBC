import { Request, Response } from 'express';

import { addMentorNote, getMentorNotesForModule } from '../services/mentorNotes.service';

const getUser = (req: Request) => (req as any).user || {};

export const getMentorNotesController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const { memberId, moduleId } = req.params;

  if (!memberId || !moduleId) {
    return res.status(400).json({ error: 'memberId and moduleId are required' });
  }

  const normalizedRole = String(user.role ?? '').toLowerCase();
  const isMentor = normalizedRole === 'mentor' || normalizedRole === 'admin';
  const isMember = Boolean(user.userId && user.userId === memberId);

  if (!isMentor && !isMember) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const notes = await getMentorNotesForModule({ memberId, moduleId });
  return res.json(notes);
};

export const postMentorNoteController = async (req: Request, res: Response) => {
  const user = getUser(req);
  const { memberId, moduleId } = req.params;
  const { content } = req.body || {};

  if (!memberId || !moduleId) {
    return res.status(400).json({ error: 'memberId and moduleId are required' });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'content is required' });
  }

  const normalizedRole = String(user.role ?? '').toLowerCase();
  if (normalizedRole !== 'mentor' && normalizedRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const mentorId = user.userId;
  if (!mentorId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const note = await addMentorNote({ memberId, moduleId, mentorId, content });
  return res.status(201).json(note);
};

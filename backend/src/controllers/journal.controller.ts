import { Request, Response } from 'express';

import { createJournalEntry, listJournalEntries } from '../services/journal.service';

export const getJournalEntriesController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const data = await listJournalEntries(user?.id || 'guest');
  res.json(data);
};

export const postJournalEntryController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const entry = await createJournalEntry(user?.id || 'guest', content);
  res.status(201).json(entry);
};

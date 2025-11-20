import { Request, Response } from 'express';

import {
  createWorkbookEntry,
  deleteWorkbookEntry,
  listWorkbookEntries,
  updateWorkbookEntry,
  type WorkbookEntrySectionType,
} from '../services/workbook.service';

type WorkbookCreateRequest = {
  moduleId?: string;
  type?: WorkbookEntrySectionType;
  content?: unknown;
};

const supportedTypes: WorkbookEntrySectionType[] = ['journal', 'moodboard', 'checklist', 'reflection'];

const getUserId = (req: Request) => (req as any).user?.userId as string | undefined;

export const createWorkbookEntryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { moduleId, type, content } = req.body as WorkbookCreateRequest;
  if (!moduleId || !type || !content) {
    return res.status(400).json({ error: 'moduleId, type, and content are required' });
  }

  if (!supportedTypes.includes(type)) {
    return res.status(400).json({ error: 'Unsupported workbook type' });
  }

  try {
    const entry = await createWorkbookEntry({ userId, moduleId, type, content });
    return res.status(201).json(entry);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Unable to create entry' });
  }
};

export const listWorkbookEntriesController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const moduleId = typeof req.query.moduleId === 'string' ? req.query.moduleId : undefined;
  if (!moduleId) {
    return res.status(400).json({ error: 'moduleId is required' });
  }

  try {
    const entries = await listWorkbookEntries({ userId, moduleId });
    return res.json({ entries });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Unable to list entries' });
  }
};

export const updateWorkbookEntryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const content = req.body?.content;
  if (!id || !content) {
    return res.status(400).json({ error: 'Entry id and content are required' });
  }

  try {
    const entry = await updateWorkbookEntry({ id, userId, content });
    return res.json(entry);
  } catch (error: any) {
    return res.status(404).json({ error: error?.message || 'Workbook entry not found' });
  }
};

export const deleteWorkbookEntryController = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Entry id is required' });
  }

  try {
    await deleteWorkbookEntry({ id, userId });
    return res.status(204).end();
  } catch (error: any) {
    return res.status(404).json({ error: error?.message || 'Workbook entry not found' });
  }
};

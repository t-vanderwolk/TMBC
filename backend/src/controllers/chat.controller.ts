import { Request, Response } from 'express';

import { createMessage, listMessages, listThreads } from '../services/chat.service';

export const getThreadsController = async (_req: Request, res: Response) => {
  const threads = await listThreads();
  res.json(threads);
};

export const getMessagesController = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const items = await listMessages(threadId);
  res.json(items);
};

export const postMessageController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { threadId, text } = req.body;
  if (!threadId || !text) {
    return res.status(400).json({ error: 'threadId and text are required' });
  }
  const author = user?.role === 'mentor' ? 'mentor' : 'member';
  const message = await createMessage(threadId, author, text);
  res.status(201).json(message);
};

import { Request, Response } from 'express';

import {
  getPendingWaitlist,
  joinWaitlist,
  updateWaitlistStatus,
} from '../services/waitlist.service';

export const join = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const entry = await joinWaitlist({ email, name });
  return res.json(entry);
};

export const listPending = async (_req: Request, res: Response) => {
  const entries = await getPendingWaitlist();
  return res.json(entries);
};

export const approve = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await updateWaitlistStatus(id, 'approved');
  return res.json(entry);
};

export const reject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await updateWaitlistStatus(id, 'rejected');
  return res.json(entry);
};

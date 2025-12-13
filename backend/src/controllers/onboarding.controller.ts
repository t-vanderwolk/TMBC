import { Request, Response } from 'express';

import {
  validateInviteCode,
  startOnboarding,
  saveProfile,
  assignMentor,
  completeOnboarding,
  finishInviteOnboarding,
} from '../services/onboarding.service';

const sendError = (res: Response, error: unknown) => {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return res.status(400).json({ error: message });
};

export const validateInviteCodeController = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Invite code is required' });
    }
    const invite = await validateInviteCode(code);
    return res.json({ invite });
  } catch (error) {
    return sendError(res, error);
  }
};

export const startOnboardingController = async (req: Request, res: Response) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }
    const user = await startOnboarding(inviteCode);
    return res.json({ user });
  } catch (error) {
    return sendError(res, error);
  }
};

export const saveProfileController = async (req: Request, res: Response) => {
  try {
    const { userId, name, dueDate, location } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await saveProfile({ userId, name, dueDate, location });
    return res.json({ user });
  } catch (error) {
    return sendError(res, error);
  }
};

export const assignMentorController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const mentor = await assignMentor(userId);
    return res.json({ mentor });
  } catch (error) {
    return sendError(res, error);
  }
};

export const completeOnboardingController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await completeOnboarding(userId);
    return res.json({ user });
  } catch (error) {
    return sendError(res, error);
  }
};

export const finishInviteOnboardingController = async (req: Request, res: Response) => {
  try {
    const { code, name, password } = req.body;
    if (!code || !name || !password) {
      return res.status(400).json({ error: 'Invite code, name, and password are required' });
    }
    const payload = await finishInviteOnboarding({ code, name, password });
    return res.json(payload);
  } catch (error) {
    return sendError(res, error);
  }
};

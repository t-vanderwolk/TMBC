import { Request, Response } from 'express';

export const requestInvite = (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  return res.json({
    status: 'received',
    email,
    message: `Hi ${name || 'friend'}, we’ll be in touch soon.`,
  });
};

export const verifyCode = (_req: Request, res: Response) => {
  return res.json({
    valid: true,
    expiresIn: '30m',
  });
};

export const createProfile = (req: Request, res: Response) => {
  const { email, firstName } = req.body;
  return res.json({
    status: 'profile created',
    user: {
      id: `new-user-${Date.now()}`,
      email,
      name: firstName ? `${firstName} Doe` : 'Taylor Member',
      role: 'MEMBER',
      onboardingComplete: true,
    },
  });
};

import { Request, Response } from 'express';

import { buildSessionToken, DevUser, findDevUser, sanitizeUser } from '../../utils/devUsers';

export const loginStub = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = findDevUser(email, password);
  const fallbackUser: DevUser = {
    id: `member-${email}`,
    email,
    name: 'Taylor Member',
    role: 'MEMBER' as const,
    password,
    title: 'Community Member',
  };
  const effectiveUser = user || fallbackUser;

  const token = buildSessionToken(effectiveUser);
  return res.json({
    token,
    user: sanitizeUser(effectiveUser),
  });
};

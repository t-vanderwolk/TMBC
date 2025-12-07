import { Request, Response } from 'express';

import { getDevUsers, sanitizeUser } from '../../utils/devUsers';

export const getStats = (_req: Request, res: Response) => {
  const users = getDevUsers();
  const members = users.filter((user) => user.role === 'MEMBER').length;
  const mentors = users.filter((user) => user.role === 'MENTOR').length;

  return res.json({
    members,
    mentors,
    pendingInvites: 3,
  });
};

export const getUsers = (_req: Request, res: Response) => {
  const users = getDevUsers();
  return res.json(users.map(sanitizeUser));
};

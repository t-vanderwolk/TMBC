import { Request, Response } from 'express';

const rooms = [
  { id: 'due-q1', title: 'Due Jan–Mar', members: 42, vibe: 'Calm planning', tag: 'circle' },
  { id: 'twins', title: 'Twin Parents', members: 18, vibe: 'Hands-on prep', tag: 'support' },
  { id: 'second', title: 'Second-time Parents Club', members: 26, vibe: 'Confident + curious', tag: 'story' },
];

export const getRooms = (_req: Request, res: Response) => {
  return res.json(rooms);
};

import { Request, Response } from 'express';

const mentees = [
  {
    id: 'mentee-1',
    name: 'Avery Hart',
    status: 'Nursery build',
    dueDate: '2026-03-12',
  },
  {
    id: 'mentee-2',
    name: 'Noor Bennett',
    status: 'Registry review',
    dueDate: '2026-05-01',
  },
  {
    id: 'mentee-3',
    name: 'Lena Ortiz',
    status: 'Postpartum prep',
    dueDate: '2026-04-20',
  },
];

export const getMentees = (_req: Request, res: Response) => {
  return res.json(mentees);
};

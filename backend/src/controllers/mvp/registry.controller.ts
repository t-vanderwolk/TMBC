import { Request, Response } from 'express';

export const getSummary = (_req: Request, res: Response) => {
  return res.json({
    totalItems: 18,
    essentials: 9,
    niceToHave: 6,
    rows: [
      {
        id: 'sleep',
        title: 'Sleep Suite',
        status: 'hand-off scheduled',
        essentials: 4,
        niceToHave: 1,
      },
      {
        id: 'feeding',
        title: 'Feeding Essentials',
        status: 'awaiting review',
        essentials: 3,
        niceToHave: 2,
      },
      {
        id: 'travel',
        title: 'Travel & Outings',
        status: 'curated',
        essentials: 2,
        niceToHave: 3,
      },
    ],
  });
};

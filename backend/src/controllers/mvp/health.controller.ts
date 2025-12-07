import { Request, Response } from 'express';

export const ping = (_req: Request, res: Response) => {
  return res.json({
    ok: true,
    area: 'health',
    timestamp: new Date().toISOString(),
  });
};

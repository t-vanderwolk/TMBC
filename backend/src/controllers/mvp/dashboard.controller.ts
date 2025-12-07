import { Request, Response } from 'express';

export const getOverview = (req: Request, res: Response) => {
  const user = (req as any).user;
  const greetingName = user?.name || 'Friend';

  return res.json({
    completedModules: 4,
    upcomingEvents: [
      { title: 'Registry handoff call', date: '2026-02-12' },
      { title: 'Mentor circle: postpartum vibes', date: '2026-02-20' },
    ],
    registryItems: {
      total: 26,
      essentials: 12,
      niceToHave: 6,
    },
    greeting: `Hi ${greetingName}, you’re glowing today.`,
  });
};

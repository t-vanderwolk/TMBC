import { Request, Response } from 'express';

const modules = [
  {
    id: 'nursery',
    slug: 'nursery',
    title: 'Nursery Essentials',
    journey: 'Nest',
    description: 'Create a calm, joyful nursery that works for family, pets, and growth.',
  },
  {
    id: 'gear',
    slug: 'gear',
    title: 'Gear & Sleep',
    journey: 'Rest',
    description: 'Select safe, sustainable gear that supports those first sleepy months.',
  },
  {
    id: 'postpartum',
    slug: 'postpartum',
    title: 'Postpartum Wellness',
    journey: 'Thrive',
    description: 'Create a gentle postpartum rhythm surrounding rest, care, and joy.',
  },
];

export const getModules = (_req: Request, res: Response) => {
  return res.json(modules);
};

export const getModuleDetail = (req: Request, res: Response) => {
  const { slug } = req.params;
  const module = modules.find((item) => item.slug === slug);
  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  return res.json({
    ...module,
    bullets: [
      'Review the journey checklist',
      'Meet with your mentor for support pairing',
      'Complete the short reflection journal',
    ],
    resources: ['Journal Prompts', 'Video: Tour the space', 'Checklist: Week-by-week'],
  });
};

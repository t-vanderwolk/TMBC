"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleDetail = exports.getModules = void 0;
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
const getModules = (_req, res) => {
    return res.json(modules);
};
exports.getModules = getModules;
const getModuleDetail = (req, res) => {
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
exports.getModuleDetail = getModuleDetail;

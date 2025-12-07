"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverview = void 0;
const getOverview = (req, res) => {
    const user = req.user;
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
exports.getOverview = getOverview;

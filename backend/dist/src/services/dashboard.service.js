"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardOverview = void 0;
const client_1 = require("../../prisma/client");
const academy_service_1 = require("./academy.service");
const WEEKLY_CHECKLIST = [
    'Upload nursery photos for mentor review',
    'Confirm registry handoff call',
    'Complete Feeding & Seating workbook',
    'Submit concierge availability',
];
const AFFILIATE_PERKS = [
    {
        name: 'Maison Bébé Bassinet Bundle',
        code: 'TMBC10',
        notes: 'Complimentary rush delivery',
    },
    {
        name: 'Cocoon & Co. Nursing Capsule',
        code: 'TAYLORVIP',
        notes: 'Save 15% through Sunday',
    },
];
const snippetFromContent = (content) => {
    if (!content)
        return '';
    const normalized = content.trim().replace(/\s+/g, ' ');
    if (normalized.length <= 120)
        return normalized;
    return `${normalized.slice(0, 117)}...`;
};
const greetUser = (user) => {
    const safeName = user?.firstName || user?.name?.split(' ')[0] || 'Friend';
    return `Hi, ${safeName}! Let’s get you ready for baby.`;
};
const getDashboardOverview = async (user) => {
    const [modules, registryCount, communityPosts, userPostCount] = await Promise.all([
        (0, academy_service_1.getModulesWithProgress)(user?.id),
        user?.id ? client_1.prisma.registryItem.count({ where: { userId: user.id } }) : Promise.resolve(0),
        client_1.prisma.communityPost.findMany({
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: {
                room: { select: { name: true } },
            },
        }),
        user?.id ? client_1.prisma.communityPost.count({ where: { userId: user.id } }) : Promise.resolve(0),
    ]);
    const completedModules = modules.filter((module) => Boolean(module.completed)).length;
    const progressPercent = modules.length ? Math.round((completedModules / modules.length) * 100) : 0;
    const nextModule = modules.find((module) => !module.completed) ?? null;
    const communityUpdates = communityPosts.map((post) => ({
        id: post.id,
        roomName: post.room?.name ?? 'Community',
        content: post.content,
        createdAt: post.createdAt.toISOString(),
    }));
    const suggestions = {
        nextModuleTitle: nextModule?.title ?? null,
        nextModuleId: nextModule?.id ?? null,
        needsRegistry: registryCount < 3,
        encourageCommunity: userPostCount === 0,
    };
    return {
        greeting: greetUser(user),
        progress: {
            academy: progressPercent,
            registry: registryCount,
        },
        completedModules,
        totalModules: modules.length,
        registryCount,
        communityUpdates,
        suggestions,
        weeklyChecklist: WEEKLY_CHECKLIST,
        affiliatePerks: AFFILIATE_PERKS,
    };
};
exports.getDashboardOverview = getDashboardOverview;

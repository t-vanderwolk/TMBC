import { prisma } from '@/lib/prisma';
import { getEvents } from './events.service';
import { getModulesWithProgress } from './academy.service';

type CommunityUpdate = {
  id: string;
  roomName: string;
  content: string;
  createdAt: string;
};

export type DashboardOverview = {
  greeting: string;
  progress: {
    academy: number;
    registry: number;
  };
  completedModules: number;
  totalModules: number;
  registryCount: number;
  communityUpdates: CommunityUpdate[];
  suggestions: {
    nextModuleTitle: string | null;
    nextModuleId: string | null;
    needsRegistry: boolean;
    encourageCommunity: boolean;
  };
  weeklyChecklist: string[];
  affiliatePerks: Array<{
    name: string;
    code: string;
    notes: string;
  }>;
};

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

const snippetFromContent = (content: string) => {
  if (!content) return '';
  const normalized = content.trim().replace(/\s+/g, ' ');
  if (normalized.length <= 120) return normalized;
  return `${normalized.slice(0, 117)}...`;
};

const greetUser = (user?: { firstName?: string | null; name?: string | null }) => {
  const safeName = user?.firstName || user?.name?.split(' ')[0] || 'Friend';
  return `Hi, ${safeName}! Let’s get you ready for baby.`;
};

export const getDashboardOverview = async (user?: { id?: string; name?: string; firstName?: string }) => {
  const [modules, registryCount, communityPosts, userPostCount] = await Promise.all([
    getModulesWithProgress(user?.id),
    user?.id ? prisma.registryItem.count({ where: { userId: user.id } }) : Promise.resolve(0),
    prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        room: { select: { name: true } },
      },
    }),
    user?.id ? prisma.communityPost.count({ where: { userId: user.id } }) : Promise.resolve(0),
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

const getLatestChatPreview = async (memberId?: string) => {
  if (!memberId) return null;
  const message = await prisma.chatMessage.findFirst({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!message) return null;

  return {
    mentorId: message.mentorId,
    memberId: message.memberId,
    lastMessage: message.content,
    updatedAt: message.createdAt.toISOString(),
    senderName: message.sender?.name ?? null,
  };
};

export const getDashboardData = async (user?: { id?: string; name?: string; firstName?: string }) => {
  const [overview, events, chatPreview] = await Promise.all([
    getDashboardOverview(user),
    getEvents('upcoming', user?.id),
    getLatestChatPreview(user?.id),
  ]);

  return {
    ...overview,
    events,
    chatPreview,
  };
};

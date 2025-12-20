import { prisma } from '@/lib/prisma';
import {
  getAcademyJourneys,
  getAcademyTracks,
  getModulesWithProgress,
  type AcademyModuleWithProgress,
} from './academy.service';
import { getEvents, type EventPayload } from './events.service';

type CommunityUpdate = {
  id: string;
  roomName: string;
  content: string;
  snippet: string;
  createdAt: string;
};

type DashboardUser = {
  id?: string;
  name?: string;
  firstName?: string | null;
  dueDate?: Date | string | null;
};

export type ChatPreview =
  | {
      mentorId?: string | null;
      memberId?: string | null;
      lastMessage: string;
      updatedAt: string;
      senderName?: string | null;
    }
  | null;

export type RegistryStatus = {
  label: string;
  detail: string;
  tone: 'calm' | 'ready' | 'steady';
};

export type CommunityStatus = {
  label: string;
  detail: string;
  prompt: string;
  tone: 'calm' | 'warm' | 'steady';
};

export type JourneyProgress = {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  percent: number;
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
  registryStatus: RegistryStatus;
  communityStatus: CommunityStatus;
  communityUpdates: CommunityUpdate[];
  announcement: CommunityUpdate | null;
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
  journeyProgress: JourneyProgress[];
  dueDateLabel?: string | null;
  babyStage?: string | null;
};

export type DashboardData = DashboardOverview & {
  events: EventPayload[];
  chatPreview: ChatPreview;
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

const formatDueDateLabel = (dueDate?: Date | string | null) => {
  if (!dueDate) return null;
  const parsed = dueDate instanceof Date ? dueDate : new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const getBabyStageLabel = (dueDate?: Date | string | null) => {
  if (!dueDate) return null;
  const parsed = dueDate instanceof Date ? dueDate : new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) return null;
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksUntil = (parsed.getTime() - Date.now()) / msPerWeek;
  if (weeksUntil <= 0) return 'Baby arrives anytime';
  if (weeksUntil <= 4) return 'Final stretch';
  if (weeksUntil <= 12) return 'Third trimester';
  if (weeksUntil <= 26) return 'Second trimester';
  return 'First trimester';
};

const buildRegistryStatus = (count: number): RegistryStatus => {
  if (count === 0) {
    return {
      label: 'Registry is waiting',
      detail: 'Add just a handful of anchors so we can curate thoughtful support.',
      tone: 'calm',
    };
  }

  if (count < 4) {
    return {
      label: 'Registry taking shape',
      detail: `${count} items are dancing in the studio—gently add more favorites when you feel ready.`,
      tone: 'ready',
    };
  }

  return {
    label: 'Registry rhythm steady',
    detail: `You’ve chosen ${count} curated pieces—our concierge will keep everything in bloom.`,
    tone: 'steady',
  };
};

const buildCommunityStatus = (count: number): CommunityStatus => {
  if (count === 0) {
    return {
      label: 'Community is listening',
      detail: 'Share a reflection or question and mentors will welcome you in the morning circle.',
      prompt: 'Say hello in the lounge',
      tone: 'calm',
    };
  }

  if (count < 3) {
    return {
      label: 'Community voice emerging',
      detail: `You’ve shared ${count} gentle notes—keep the rhythm soft and steady.`,
      prompt: 'Drop another reflection',
      tone: 'warm',
    };
  }

  return {
    label: 'Community rhythm strong',
    detail: `You’ve contributed ${count} thoughtful moments—the lounge values your voice.`,
    prompt: 'Keep leading with curiosity',
    tone: 'steady',
  };
};

const greetUser = (user?: DashboardUser) => {
  const safeName = user?.firstName || user?.name?.split(' ')[0] || 'Friend';
  return `Hi, ${safeName}! Let’s get you ready for baby.`;
};

const buildJourneyProgress = (
  journeys: Awaited<ReturnType<typeof getAcademyJourneys>>,
  tracks: Awaited<ReturnType<typeof getAcademyTracks>>,
  modules: AcademyModuleWithProgress[],
): JourneyProgress[] => {
  return journeys.map((journey) => {
    const journeyTrackIds = tracks
      .filter((track) => track.journeyId === journey.id)
      .map((track) => track.id);
    const journeyModules = modules.filter((module) => journeyTrackIds.includes(module.trackId));
    const completed = journeyModules.filter((module) => Boolean(module.completed)).length;
    const total = journeyModules.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    return {
      id: journey.id,
      title: journey.title,
      description: journey.description,
      completed,
      total,
      percent,
    };
  });
};

export const getDashboardOverview = async (user?: DashboardUser) => {
  const [modules, registryCount, communityPosts, userPostCount, journeys, tracks] = await Promise.all([
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
    getAcademyJourneys(),
    getAcademyTracks(),
  ]);

  const completedModules = modules.filter((module) => Boolean(module.completed)).length;
  const progressPercent = modules.length ? Math.round((completedModules / modules.length) * 100) : 0;
  const nextModule = modules.find((module) => !module.completed) ?? null;

  const communityUpdates = communityPosts.map((post) => ({
    id: post.id,
    roomName: post.room?.name ?? 'Community',
    content: post.content,
    snippet: snippetFromContent(post.content),
    createdAt: post.createdAt.toISOString(),
  }));

  const suggestions = {
    nextModuleTitle: nextModule?.title ?? null,
    nextModuleId: nextModule?.id ?? null,
    needsRegistry: registryCount < 3,
    encourageCommunity: userPostCount === 0,
  };

  const registryStatus = buildRegistryStatus(registryCount);
  const communityStatus = buildCommunityStatus(userPostCount);
  const journeyProgress = buildJourneyProgress(journeys, tracks, modules);
  const dueDateLabel = formatDueDateLabel(user?.dueDate);
  const babyStage = getBabyStageLabel(user?.dueDate);

  return {
    greeting: greetUser(user),
    progress: {
      academy: progressPercent,
      registry: registryCount,
    },
    completedModules,
    totalModules: modules.length,
    registryCount,
    registryStatus,
    communityStatus,
    communityUpdates,
    announcement: communityUpdates[0] ?? null,
    suggestions,
    weeklyChecklist: WEEKLY_CHECKLIST,
    affiliatePerks: AFFILIATE_PERKS,
    journeyProgress,
    dueDateLabel,
    babyStage,
  };
};

const getLatestChatPreview = async (memberId?: string): Promise<ChatPreview> => {
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

export const getDashboardData = async (user?: DashboardUser) => {
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

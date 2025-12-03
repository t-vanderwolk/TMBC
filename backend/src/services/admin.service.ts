import { Prisma, Role } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { getPendingWaitlist, updateWaitlistStatus } from './waitlist.service';

const RELATIVE_BUCKETS = [
  { limit: 60, label: (value: number) => `${value}m ago` },
  { limit: 1440, label: (value: number) => `${Math.floor(value / 60)}h ago` },
  { limit: Infinity, label: (value: number) => `${Math.floor(value / 1440)}d ago` },
];

const formatRelativeTime = (date: Date) => {
  const minutesAgo = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
  for (const bucket of RELATIVE_BUCKETS) {
    if (minutesAgo < bucket.limit) {
      return bucket.label(minutesAgo);
    }
  }
  return 'just now';
};

export type SignupSeriesPoint = {
  date: string;
  count: number;
};

export type RegistrySeriesPoint = {
  label: string;
  count: number;
};

export type SystemActivity = {
  id: string;
  summary: string;
  timestamp: string;
};

export type AdminStatsPayload = {
  totalMembers: number;
  totalMentors: number;
  activeEvents: number;
  totalRegistryItems: number;
  todaysSignups: number;
  signupsSeries: SignupSeriesPoint[];
  registrySeries: RegistrySeriesPoint[];
  systemActivity: SystemActivity[];
};

const PURCHASED_STATUSES = ['PURCHASED', 'PURCHASED_ELSEWHERE'];

type AcademyModuleContent = {
  lecture?: string;
  explore?: string;
  apply?: string;
  journalPrompt?: string;
  slides?: string[];
};

const splitLectureIntoSlides = (raw?: string): string[] => {
  if (!raw) return [];
  return raw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const normalizeModuleContent = (value: Prisma.JsonValue | null | undefined): AcademyModuleContent => {
  if (!value || typeof value !== 'object') {
    return {};
  }
  return value as AcademyModuleContent;
};

export const getAdminStats = async (): Promise<AdminStatsPayload> => {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [membersCount, mentorsCount, registryCount, activeEvents] = await Promise.all([
    prisma.user.count({ where: { role: Role.MEMBER } }),
    prisma.user.count({ where: { role: Role.MENTOR } }),
    prisma.registryItem.count(),
    prisma.event.count({ where: { status: { in: ['published', 'scheduled'] } } }),
  ]);

  const todaysSignups = await prisma.user.count({
    where: {
      createdAt: {
        gte: todayStart,
      },
    },
  });

  const signupsSeriesRows = await prisma.$queryRaw<
    { date: string; count: number }[]
  >`SELECT TO_CHAR(day, 'Mon DD') AS "date", count FROM (
      SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*) AS count
      FROM "User"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
    ) sub;`;

  const signupsSeries = signupsSeriesRows.map((row) => ({
    date: row.date,
    count: Number(row.count),
  }));

  const registrySeriesRows = await prisma.$queryRaw<
    { moduleCode: string | null; count: number }[]
  >`SELECT COALESCE("moduleCode", 'untracked') AS "moduleCode", COUNT(*) AS count
      FROM "RegistryItem"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY "moduleCode"
      ORDER BY count DESC
      LIMIT 6;`;

  const moduleCodes = Array.from(
    new Set(registrySeriesRows.map((row) => row.moduleCode).filter(Boolean)),
  ) as string[];
  const modules = moduleCodes.length
    ? await prisma.academyModule.findMany({
        where: { id: { in: moduleCodes } },
      })
    : [];
  const moduleNameMap = new Map(modules.map((module) => [module.id, module.title]));

  const registrySeries = registrySeriesRows.map((row) => ({
    label: moduleNameMap.get(row.moduleCode ?? '') ?? row.moduleCode ?? 'untracked',
    count: Number(row.count),
  }));

  const [mentorNotes, registryItems, events] = await Promise.all([
    prisma.mentorNote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        mentor: { select: { name: true } },
        member: { select: { name: true } },
      },
    }),
    prisma.registryItem.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 3,
      include: {
        user: { select: { name: true } },
      },
    }),
    prisma.event.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 3,
    }),
  ]);

  const activities = [
    ...mentorNotes.map((note) => ({
      id: `note-${note.id}`,
      summary: `${note.mentor?.name ?? 'Mentor'} shared feedback for ${note.member?.name ?? 'a member'}`,
      timestamp: formatRelativeTime(note.createdAt),
      created: note.createdAt,
    })),
    ...registryItems.map((item) => ({
      id: `registry-${item.id}`,
      summary: `${item.user?.name ?? 'Member'} updated registry item ${item.title}`,
      timestamp: formatRelativeTime(item.updatedAt),
      created: item.updatedAt,
    })),
    ...events.map((event) => ({
      id: `event-${event.id}`,
      summary: `Event "${event.title}" status is ${event.status}`,
      timestamp: formatRelativeTime(event.updatedAt),
      created: event.updatedAt,
    })),
  ];

  const systemActivity = activities
    .sort((a, b) => b.created.getTime() - a.created.getTime())
    .slice(0, 5)
    .map((activity) => ({
      id: activity.id,
      summary: activity.summary,
      timestamp: activity.timestamp,
    }));

  return {
    totalMembers: membersCount,
    totalMentors: mentorsCount,
    activeEvents,
    totalRegistryItems: registryCount,
    todaysSignups,
    signupsSeries,
    registrySeries,
    systemActivity,
  };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'mentor' | 'admin';
  inviteCode?: string;
  joinedAt: string;
  status: 'active' | 'disabled';
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const users = await prisma.user.findMany({
    include: {
      consumedInvite: { select: { code: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: user.role.toLowerCase() as AdminUser['role'],
    inviteCode: user.consumedInvite?.code ?? undefined,
    joinedAt: user.createdAt.toISOString(),
    status: user.disabled ? 'disabled' : 'active',
  }));
};

type UserUpdatePayload = {
  role?: 'member' | 'mentor' | 'admin';
  status?: 'active' | 'disabled';
  name?: string;
};

export const updateAdminUser = async (id: string, payload: UserUpdatePayload) => {
  const data: Prisma.UserUpdateInput = {};
  if (payload.role) {
    data.role = payload.role.toUpperCase() as Role;
  }
  if (payload.status) {
    data.disabled = payload.status === 'disabled';
  }
  if (payload.name) {
    data.name = payload.name;
  }

  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteAdminUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};

export type AdminMentor = {
  id: string;
  name: string;
  mentees: number;
  performance: {
    workbookFeedback: number;
    registryNotes: number;
    eventsHosted: number;
  };
  lastActive: string;
};

export const getAdminMentors = async (): Promise<AdminMentor[]> => {
  const mentors = await prisma.user.findMany({
    where: { role: Role.MENTOR },
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const feedbackGroups = await prisma.mentorFeedback.groupBy({
    by: ['mentorId'],
    _count: { _all: true },
  });

  const noteGroups = await prisma.mentorNote.groupBy({
    by: ['mentorId'],
    _count: { _all: true },
  });

  const eventGroups = await prisma.event.groupBy({
    by: ['hostId'],
    _count: { _all: true },
  });

  const menteeRows = await prisma.$queryRaw<{ mentorId: string; mentees: number }[]>`
    SELECT "mentorId", COUNT(DISTINCT "memberId") AS mentees
    FROM "MentorNote"
    GROUP BY "mentorId";
  `;

  const feedbackMap = new Map(feedbackGroups.map((row) => [row.mentorId, row._count._all]));
  const noteMap = new Map(noteGroups.map((row) => [row.mentorId, row._count._all]));
  const eventMap = new Map(eventGroups.map((row) => [row.hostId, row._count._all]));
  const menteeMap = new Map(menteeRows.map((row) => [row.mentorId, Number(row.mentees)]));

  return mentors.map((mentor) => ({
    id: mentor.id,
    name: mentor.name ?? 'Mentor',
    mentees: menteeMap.get(mentor.id) ?? 0,
    performance: {
      workbookFeedback: feedbackMap.get(mentor.id) ?? 0,
      registryNotes: noteMap.get(mentor.id) ?? 0,
      eventsHosted: eventMap.get(mentor.id) ?? 0,
    },
    lastActive: formatRelativeTime(mentor.updatedAt),
  }));
};

type MentorUpdatePayload = {
  status?: 'active' | 'disabled';
  name?: string;
};

export const updateAdminMentor = async (id: string, payload: MentorUpdatePayload) => {
  const data: Prisma.UserUpdateInput = {};
  if (payload.status) {
    data.disabled = payload.status === 'disabled';
  }
  if (payload.name) {
    data.name = payload.name;
  }

  return prisma.user.update({
    where: { id },
    data,
  });
};

export type AdminEvent = {
  id: string;
  name: string;
  date: string;
  location: string | null;
  status: string;
  rsvpCount: number;
};

type CreateEventPayload = {
  name: string;
  date: string;
  location?: string;
  description?: string;
  status?: string;
  type?: string;
  format?: string;
};

export const getAdminEvents = async (): Promise<AdminEvent[]> => {
  const events = await prisma.event.findMany({
    include: {
      rsvps: true,
    },
    orderBy: { startTime: 'asc' },
  });

  return events.map((event) => ({
    id: event.id,
    name: event.title,
    date: event.startTime.toISOString(),
    location: event.location ?? null,
    status: event.status,
    rsvpCount: event.rsvps.length,
  }));
};

export const createAdminEvent = async (payload: CreateEventPayload, hostId?: string, hostName?: string) => {
  const startTime = new Date(payload.date);
  if (Number.isNaN(startTime.getTime())) {
    throw new Error('Invalid start date');
  }

  const event = await prisma.event.create({
    data: {
      title: payload.name,
      location: payload.location,
      description: payload.description,
      status: payload.status ?? 'scheduled',
      type: payload.type,
      format: payload.format,
      startTime,
      endTime: payload.date ? new Date(payload.date) : undefined,
      hostId,
      hostName,
    },
  });

  return {
    id: event.id,
    name: event.title,
    date: event.startTime.toISOString(),
    location: event.location,
    status: event.status,
    rsvpCount: 0,
  };
};

type UpdateEventPayload = Partial<CreateEventPayload>;

export const updateAdminEvent = async (id: string, payload: UpdateEventPayload) => {
  const data: Prisma.EventUpdateInput = {};
  if (payload.name) data.title = payload.name;
  if (payload.location !== undefined) data.location = payload.location;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.status) data.status = payload.status;
  if (payload.type) data.type = payload.type;
  if (payload.format) data.format = payload.format;
  if (payload.date) {
    const nextDate = new Date(payload.date);
    if (Number.isNaN(nextDate.getTime())) {
      throw new Error('Invalid date');
    }
    data.startTime = nextDate;
    data.endTime = nextDate;
  }

  const event = await prisma.event.update({
    where: { id },
    data,
    include: { rsvps: true },
  });

  return {
    id: event.id,
    name: event.title,
    date: event.startTime.toISOString(),
    location: event.location,
    status: event.status,
    rsvpCount: event.rsvps.length,
  };
};

export const deleteAdminEvent = async (id: string) => {
  await prisma.event.delete({ where: { id } });
  return { id };
};

export type RegistryEntryRow = {
  id: string;
  userName: string;
  merchant: string;
  productTitle: string;
  moduleId: string | null;
  purchased: boolean;
  createdAt: string;
};

export type RegistryMonitorResult = {
  latestEntries: RegistryEntryRow[];
  filters: { label: string; value: string }[];
  affiliateSummary: { label: string; revenue: number }[];
};

export const getAdminRegistryMonitor = async (): Promise<RegistryMonitorResult> => {
  const entries = await prisma.registryItem.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const latestEntries = entries.map((entry) => ({
    id: entry.id,
    userName: entry.user?.name ?? entry.user?.email ?? 'Member',
    merchant: entry.merchant ?? 'Unknown',
    productTitle: entry.title,
    moduleId: entry.moduleCode,
    purchased: PURCHASED_STATUSES.includes(entry.status),
    createdAt: entry.createdAt.toISOString(),
  }));

  const filters = Array.from(
    new Set(entries.map((entry) => entry.merchant ?? 'Unknown')),
  ).map((merchant) => ({
    label: merchant,
    value: merchant,
  }));

  const affiliateRows = await prisma.$queryRaw<
    { merchant: string | null; revenue: number }[]
  >`SELECT COALESCE("merchant", 'Unknown') AS merchant, SUM(COALESCE("price", 0) * "quantity") AS revenue
      FROM "RegistryItem"
      WHERE "status" IN ('PURCHASED', 'PURCHASED_ELSEWHERE')
      GROUP BY merchant
      ORDER BY revenue DESC
      LIMIT 6;`;

  const affiliateSummary = affiliateRows.map((row) => ({
    label: row.merchant ?? 'Unknown',
    revenue: Number(row.revenue ?? 0),
  }));

  return {
    latestEntries,
    filters,
    affiliateSummary,
  };
};

export type AdminModule = {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  lecture?: string;
  explore?: string;
  apply?: string;
  journalPrompt?: string;
  updatedAt: string;
};

export const getAdminModules = async (): Promise<AdminModule[]> => {
  const modules = await prisma.academyModule.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return modules.map((module) => {
    const content = normalizeModuleContent(module.content);
    return {
      id: module.id,
      code: module.id,
      title: module.title,
      subtitle: module.subtitle ?? '',
      heroImage: module.heroImage ?? '',
      lecture: content.lecture ?? '',
      explore: content.explore ?? '',
      apply: content.apply ?? '',
      journalPrompt: content.journalPrompt ?? '',
      slides: splitLectureIntoSlides(content.lecture ?? ''),
      updatedAt: module.updatedAt.toISOString(),
    };
  });
};

export const updateAdminModule = async (
  id: string,
  payload: Partial<Omit<AdminModule, 'id' | 'code' | 'updatedAt'>>,
) => {
  const existingModule = await prisma.academyModule.findUniqueOrThrow({ where: { id } });
  const existingContent = normalizeModuleContent(existingModule.content);
  const contentUpdates: AcademyModuleContent = {};

  const data: Prisma.AcademyModuleUpdateInput = {};
  if (payload.title) data.title = payload.title;
  if (payload.subtitle !== undefined) data.subtitle = payload.subtitle;
  if (payload.heroImage !== undefined) data.heroImage = payload.heroImage;
  if (payload.lecture !== undefined) contentUpdates.lecture = payload.lecture;
  if (payload.explore !== undefined) contentUpdates.explore = payload.explore;
  if (payload.apply !== undefined) contentUpdates.apply = payload.apply;
  if (payload.journalPrompt !== undefined) contentUpdates.journalPrompt = payload.journalPrompt;

  if (Object.keys(contentUpdates).length > 0) {
    const mergedContent: AcademyModuleContent = {
      ...existingContent,
      ...contentUpdates,
    };
    mergedContent.slides = splitLectureIntoSlides(mergedContent.lecture ?? '');
    data.content = mergedContent;
  }

  const module = await prisma.academyModule.update({
    where: { id },
    data,
  });

  const updatedContent = normalizeModuleContent(module.content);

  return {
    id: module.id,
    code: module.id,
    title: module.title,
    subtitle: module.subtitle ?? '',
    heroImage: module.heroImage ?? '',
    lecture: updatedContent.lecture ?? '',
    explore: updatedContent.explore ?? '',
    apply: updatedContent.apply ?? '',
    journalPrompt: updatedContent.journalPrompt ?? '',
    slides: updatedContent.slides ?? [],
    updatedAt: module.updatedAt.toISOString(),
  };
};

export type AdminSettingsPayload = {
  inviteOnly: boolean;
  defaultMentorId?: string;
  pinterestClientId?: string;
  pinterestClientSecret?: string;
  myRegistryMerchantId?: string;
  affiliateNetwork?: string;
};

export const getAdminSettings = async (): Promise<AdminSettingsPayload> => {
  const settings = await prisma.adminSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  return {
    inviteOnly: settings.inviteOnly,
    defaultMentorId: settings.defaultMentorId ?? undefined,
    pinterestClientId: settings.pinterestClientId ?? undefined,
    pinterestClientSecret: settings.pinterestSecret ?? undefined,
    myRegistryMerchantId: settings.myRegistryMerchantId ?? undefined,
    affiliateNetwork: settings.affiliateNetwork ?? undefined,
  };
};

export const updateAdminSettings = async (payload: Partial<AdminSettingsPayload>) => {
  const data: Prisma.AdminSettingsUpdateInput = {};
  if (payload.inviteOnly !== undefined) data.inviteOnly = payload.inviteOnly;
  if (payload.defaultMentorId !== undefined) data.defaultMentorId = payload.defaultMentorId;
  if (payload.pinterestClientId !== undefined) data.pinterestClientId = payload.pinterestClientId;
  if (payload.pinterestClientSecret !== undefined) data.pinterestSecret = payload.pinterestClientSecret;
  if (payload.myRegistryMerchantId !== undefined) data.myRegistryMerchantId = payload.myRegistryMerchantId;
  if (payload.affiliateNetwork !== undefined) data.affiliateNetwork = payload.affiliateNetwork;

  const settings = await prisma.adminSettings.upsert({
    where: { id: 1 },
    update: data,
    create: {
      inviteOnly: payload.inviteOnly ?? true,
      defaultMentorId: payload.defaultMentorId,
      pinterestClientId: payload.pinterestClientId,
      pinterestSecret: payload.pinterestClientSecret,
      myRegistryMerchantId: payload.myRegistryMerchantId,
      affiliateNetwork: payload.affiliateNetwork,
    },
  });

  return {
    inviteOnly: settings.inviteOnly,
    defaultMentorId: settings.defaultMentorId ?? undefined,
    pinterestClientId: settings.pinterestClientId ?? undefined,
    pinterestClientSecret: settings.pinterestSecret ?? undefined,
    myRegistryMerchantId: settings.myRegistryMerchantId ?? undefined,
    affiliateNetwork: settings.affiliateNetwork ?? undefined,
  };
};

export const getAdminWaitlistEntries = async () => {
  return getPendingWaitlist();
};

export const approveWaitlistEntry = async (id: string) => {
  return updateWaitlistStatus(id, 'approved');
};

export const rejectWaitlistEntry = async (id: string) => {
  return updateWaitlistStatus(id, 'rejected');
};

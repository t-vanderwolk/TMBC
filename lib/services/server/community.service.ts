import { CommunityPostSourceType, Role } from '@prisma/client';
import type {
  CommunityPost,
  CommunityReply,
  User,
  WorkbookSection,
} from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { getEvents, type EventPayload } from './events.service';

type CommunityUser = Pick<User, 'id' | 'name' | 'role'>;

const ROLE_PRIORITY: Record<Role, number> = {
  MEMBER: 1,
  MENTOR: 2,
  ADMIN: 3,
};

const getRoleLevel = (role: Role) => ROLE_PRIORITY[role] ?? 1;

const hasAccess = (userRole: Role, minRole: Role) => getRoleLevel(userRole) >= getRoleLevel(minRole);

const nameOrFallback = (user?: { name?: string | null } | null) => user?.name ?? 'Friend';

export type CommunityRoomSummary = {
  id: string;
  name: string;
  description: string | null;
  moduleId: string | null;
  moduleTitle: string | null;
  minRole: Role;
  latestPostSnippet: string | null;
  latestPostAuthor: string | null;
  latestPostAuthorRole: Role | null;
  latestPostAt: string | null;
};

export type CommunityReplyDetail = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
};

export type CommunityPostDetail = {
  id: string;
  roomId: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  isAnnouncement: boolean;
  isPinned: boolean;
  pinnedAt: string | null;
  sourceType: CommunityPostSourceType;
  sourceSection: WorkbookSection | null;
  sourcePrompt: string | null;
  isAnonymous: boolean;
  isMentorPrompt: boolean;
  workbookEntryId: string | null;
  replies: CommunityReplyDetail[];
};

export type CommunityRoomDetail = {
  id: string;
  name: string;
  description: string | null;
  moduleId: string | null;
  moduleTitle: string | null;
  minRole: Role;
  posts: CommunityPostDetail[];
};

const mapReply = (reply: CommunityReply & { user: CommunityUser | null }): CommunityReplyDetail => ({
  id: reply.id,
  content: reply.content,
  createdAt: reply.createdAt.toISOString(),
  authorId: reply.userId,
  authorName: nameOrFallback(reply.user),
  authorRole: reply.user?.role ?? Role.MEMBER,
});

const mapPost = (
  post: CommunityPost & {
    user: CommunityUser | null;
    replies: (CommunityReply & { user: CommunityUser | null })[];
  },
): CommunityPostDetail => ({
  id: post.id,
  roomId: post.roomId,
  content: post.content,
  createdAt: post.createdAt.toISOString(),
  authorId: post.userId,
  authorName: nameOrFallback(post.user),
  authorRole: post.user?.role ?? Role.MEMBER,
  isAnnouncement: post.isAnnouncement,
  isPinned: post.isPinned,
  pinnedAt: post.pinnedAt ? post.pinnedAt.toISOString() : null,
  sourceType: post.sourceType,
  sourceSection: post.sourceSection ?? null,
  sourcePrompt: post.sourcePrompt ?? null,
  isAnonymous: post.isAnonymous,
  isMentorPrompt: post.isMentorPrompt,
  workbookEntryId: post.workbookEntryId ?? null,
  replies: post.replies.map(mapReply),
});

export const getCommunityRooms = async (userRole: Role): Promise<CommunityRoomSummary[]> => {
  const rooms = await prisma.communityRoom.findMany({
    include: {
      module: {
        select: {
          id: true,
          title: true,
        },
      },
      posts: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const accessibleRooms = rooms.filter((room) => hasAccess(userRole, room.minRole));
  const moduleRooms = accessibleRooms.filter((room) => Boolean(room.moduleId));
  const generalRooms = accessibleRooms.filter((room) => !room.moduleId);

  return [...moduleRooms, ...generalRooms].map((room) => {
    const latest = room.posts?.[0];
    return {
      id: room.id,
      name: room.name,
      description: room.description,
      moduleId: room.moduleId,
      moduleTitle: room.module?.title ?? null,
      minRole: room.minRole,
      latestPostSnippet: latest?.content ?? null,
      latestPostAuthor: latest?.user?.name ?? null,
      latestPostAuthorRole: latest?.user?.role ?? null,
      latestPostAt: latest?.createdAt ? latest.createdAt.toISOString() : null,
    };
  });
};

export const getCommunityRoom = async (userRole: Role, roomId: string): Promise<CommunityRoomDetail> => {
  const room = await prisma.communityRoom.findUnique({
    where: { id: roomId },
    include: {
      module: {
        select: {
          id: true,
          title: true,
        },
      },
      posts: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          replies: {
            orderBy: { createdAt: 'asc' },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  if (!hasAccess(userRole, room.minRole)) {
    throw new Error('Access to this room is restricted');
  }

  return {
    id: room.id,
    name: room.name,
    description: room.description,
    moduleId: room.moduleId,
    moduleTitle: room.module?.title ?? null,
    minRole: room.minRole,
    posts: room.posts.map(mapPost),
  };
};

export const createCommunityPost = async (input: {
  user: CommunityUser;
  roomId: string;
  content: string;
  isAnnouncement?: boolean;
  isPinned?: boolean;
  sourceType?: CommunityPostSourceType;
  sourceSection?: WorkbookSection;
  isAnonymous?: boolean;
  workbookEntryId?: string;
  isMentorPrompt?: boolean;
  sourcePrompt?: string;
}): Promise<CommunityPostDetail> => {
  const {
    user,
    roomId,
    isAnnouncement = false,
    isPinned = false,
    sourceType = CommunityPostSourceType.COMMUNITY,
    sourceSection,
    isAnonymous = false,
    workbookEntryId,
    isMentorPrompt = false,
    sourcePrompt,
  } = input;
  const content = input.content.trim();
  if (!content) {
    throw new Error('Please share something thoughtful before posting.');
  }

  const room = await prisma.communityRoom.findUnique({ where: { id: roomId } });
  if (!room) {
    throw new Error('Room not found');
  }
  if (!hasAccess(user.role, room.minRole)) {
    throw new Error('Access to this room is restricted');
  }

  const isMentorOrAdmin = user.role === Role.MENTOR || user.role === Role.ADMIN;
  if (isAnnouncement && !isMentorOrAdmin) {
    throw new Error('Only mentors and admins can create announcements.');
  }

  if (isPinned && !isMentorOrAdmin) {
    throw new Error('Only mentors and admins can pin posts.');
  }

  const post = await prisma.communityPost.create({
    data: {
      roomId,
      userId: user.id,
      content,
      isAnnouncement,
      isPinned,
      pinnedAt: isPinned ? new Date() : undefined,
      sourceType,
      sourceSection,
      isAnonymous,
      workbookEntryId,
      isMentorPrompt,
      sourcePrompt,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  return mapPost(post);
};

export const shareWorkbookReflection = async (input: {
  user: CommunityUser;
  moduleId: string;
  promptTitle: string;
  response: string;
  section: WorkbookSection;
  anonymous?: boolean;
  workbookEntryId?: string;
}): Promise<CommunityPostDetail> => {
  const content = input.response.trim();
  if (!content) {
    throw new Error('Reflection cannot be empty.');
  }
  const room = await ensureModuleRoom(input.moduleId);
  return createCommunityPost({
    user: input.user,
    roomId: room.id,
    content,
    sourceType: CommunityPostSourceType.WORKBOOK,
    sourceSection: input.section,
    isAnonymous: input.anonymous ?? false,
    workbookEntryId: input.workbookEntryId,
    sourcePrompt: input.promptTitle,
  });
};

export const createCommunityReply = async (input: {
  user: CommunityUser;
  postId: string;
  content: string;
}): Promise<CommunityReplyDetail> => {
  const content = input.content.trim();
  if (!content) {
    throw new Error('Please add a reply before sending.');
  }

  const post = await prisma.communityPost.findUnique({
    where: { id: input.postId },
    include: {
      room: {
        select: {
          minRole: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  if (!post.room) {
    throw new Error('Room context missing');
  }

  if (!hasAccess(input.user.role, post.room.minRole)) {
    throw new Error('Access to this room is restricted');
  }

  const reply = await prisma.communityReply.create({
    data: {
      postId: input.postId,
      userId: input.user.id,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return mapReply(reply);
};

const describeModuleRoom = (moduleTitle?: string) => {
  const safeTitle = moduleTitle?.trim();
  if (safeTitle) {
    return {
      name: `${safeTitle} · Discussion`,
      description: `Share reflections and questions inspired by ${safeTitle}.`,
    };
  }
  return {
    name: 'Module discussion',
    description: 'Gather your thoughts while you move through this module.',
  };
};

export const ensureModuleRoom = async (moduleId: string, moduleTitle?: string, mentorPrompt?: string) => {
  const { name, description } = describeModuleRoom(moduleTitle);
  const room = await prisma.communityRoom.upsert({
    where: { moduleId },
    create: {
      name,
      description,
      moduleId,
      minRole: Role.MEMBER,
    },
    update: {
      name,
      description,
    },
  });
  await createMentorPromptIfMissing(room.id, moduleTitle, mentorPrompt);
  return room;
};

const sectionLabels: Record<WorkbookSection, string> = {
  REFLECT: 'Reflections',
  APPLY: 'Applied changes',
  INTEGRATE: 'Integration notes',
};

export type CommunityHighlightReflection = {
  id: string;
  content: string;
  sectionLabel: string;
  createdAt: string;
  moduleTitle: string | null;
  sourcePrompt: string | null;
};

export type CommunityHighlights = {
  reflections: CommunityHighlightReflection[];
  mentorNote: {
    content: string;
    createdAt: string;
    mentorName: string | null;
  } | null;
  upcomingEvent: EventPayload | null;
};

const findMentorSeedUserId = async () => {
  const mentor = await prisma.user.findFirst({ where: { role: Role.MENTOR } });
  if (mentor) return mentor.id;
  const admin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  return admin?.id ?? null;
};

const defaultMentorPrompt = (moduleTitle?: string) =>
  moduleTitle
    ? `Share a gentle reflection about ${moduleTitle} — what moved you, what you're trying, what you'd like to revisit.`
    : 'Share a gentle reflection about the rituals you practiced in this module.';

const createMentorPromptIfMissing = async (roomId: string, moduleTitle?: string, promptText?: string) => {
  const existing = await prisma.communityPost.findFirst({
    where: {
      roomId,
      isMentorPrompt: true,
    },
  });
  if (existing) return existing;

  const mentorId = await findMentorSeedUserId();
  if (!mentorId) return null;

  return createCommunityPost({
    user: { id: mentorId, name: 'Mentor', role: Role.MENTOR },
    roomId,
    content: (promptText ?? defaultMentorPrompt(moduleTitle)).trim(),
    isPinned: true,
    sourceType: CommunityPostSourceType.MENTOR_PROMPT,
    isMentorPrompt: true,
  });
};

export const getCommunityHighlights = async (userId?: string): Promise<CommunityHighlights> => {
  const targetModuleId = userId
    ? (
        await prisma.academyProgress.findFirst({
          where: { userId, completed: false },
          orderBy: { updatedAt: 'desc' },
        })
      )?.moduleId ?? null
    : null;

  const reflections = await prisma.communityPost.findMany({
    where: {
      sourceType: CommunityPostSourceType.WORKBOOK,
      room: targetModuleId ? { moduleId: targetModuleId } : undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      room: {
        select: {
          module: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  const mentorNote =
    userId &&
    (await prisma.mentorNote.findFirst({
      where: { memberId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: {
          select: {
            name: true,
          },
        },
      },
    }));

  const events = await getEvents('upcoming', userId);
  const upcomingEvent =
    events.find((event) => {
      const key = `${event.type ?? ''} ${event.format ?? ''}`.toLowerCase();
      return key.includes('office');
    }) ?? events[0] ?? null;

  return {
    reflections: reflections.map((post) => ({
      id: post.id,
      content: post.content,
      sectionLabel: post.sourceSection ? sectionLabels[post.sourceSection] ?? 'Reflections' : 'Community reflections',
      createdAt: post.createdAt.toISOString(),
      moduleTitle: post.room?.module?.title ?? null,
      sourcePrompt: post.sourcePrompt ?? null,
    })),
    mentorNote: mentorNote
      ? {
          content: mentorNote.content,
          createdAt: mentorNote.createdAt.toISOString(),
          mentorName: mentorNote.mentor?.name ?? null,
        }
      : null,
    upcomingEvent,
  };
};

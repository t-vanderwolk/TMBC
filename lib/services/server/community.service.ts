import { Role } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export type CommunityRoomSummary = {
  id: string;
  name: string;
  description: string | null;
  recentPostSnippet: string | null;
  recentPostAuthor: string | null;
  recentPostAt: string | null;
};

export type CommunityPostPayload = {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  author: string | null;
  content: string;
  createdAt: string;
};

interface AddCommunityPostInput {
  roomId: string;
  userId: string;
  content: string;
}

const mapPost = (post: {
  id: string;
  roomId: string;
  content: string;
  createdAt: Date;
  room?: { name?: string } | null;
  user?: { name?: string | null } | null;
  userId: string;
}) => ({
  id: post.id,
  roomId: post.roomId,
  roomName: post.room?.name ?? 'Community',
  userId: post.userId,
  author: post.user?.name ?? 'Member',
  content: post.content,
  createdAt: post.createdAt?.toISOString() ?? new Date().toISOString(),
});

export const getCommunityRooms = async (): Promise<CommunityRoomSummary[]> => {
  const rooms = await prisma.communityRoom.findMany({
    include: {
      posts: {
        where: {
          user: {
            role: Role.MEMBER,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return rooms.map((room) => {
    const latest = room.posts?.[0];
    return {
      id: room.id,
      name: room.name,
      description: room.description,
      recentPostSnippet: latest?.content ?? null,
      recentPostAuthor: latest?.user?.name ?? null,
      recentPostAt: latest?.createdAt ? latest.createdAt.toISOString() : null,
    };
  });
};

export const getRoomPosts = async (roomId: string): Promise<CommunityPostPayload[]> => {
  const posts = await prisma.communityPost.findMany({
    where: {
      roomId,
      user: {
        role: Role.MEMBER,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      room: {
        select: {
          name: true,
        },
      },
    },
  });

  return posts.map(mapPost);
};

export const addCommunityPost = async ({ roomId, userId, content }: AddCommunityPostInput) => {
  const author = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!author || author.role !== Role.MEMBER) {
    throw new Error('Only members can post in the community rooms.');
  }

  const room = await prisma.communityRoom.findUnique({
    where: { id: roomId },
    include: { posts: true },
  });
  if (!room) {
    throw new Error('Community room not found');
  }

  const post = await prisma.communityPost.create({
    data: {
      roomId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      room: {
        select: {
          name: true,
        },
      },
    },
  });

  return mapPost(post);
};

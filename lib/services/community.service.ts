import { prisma } from '@/lib/prisma';

const FALLBACK_POLL = {
  id: 0,
  question: 'How do you feel today?',
  options: ['Calm', 'Overwhelmed'],
  createdAt: new Date(),
};

export async function getCommunityFeed() {
  const announcements = [
    { id: 'announce-1', message: 'Weekly salon added for birthing partners.' },
    { id: 'announce-2', message: 'Nursery styling drop-in every Thursday.' },
  ];
  const posts = await prisma.communityPost.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  const poll = await getPoll();
  const mentorTips = ['Try a slow walk before sunset.', 'Set a gentle alarm to honor naps.'];
  return {
    announcements,
    posts,
    poll,
    mentorTips,
  };
}

export async function createPost(userId: string, content: string, roomId?: string) {
  let targetRoomId = roomId;
  if (!targetRoomId) {
    const defaultRoom = await prisma.communityRoom.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!defaultRoom) {
      throw new Error('Unable to find a community room');
    }
    targetRoomId = defaultRoom.id;
  }

  return prisma.communityPost.create({
    data: { roomId: targetRoomId, userId, content },
  });
}

export async function getPoll() {
  return FALLBACK_POLL;
}

export async function voteInPoll() {
  return { message: 'Polls are not supported in this environment.' };
}

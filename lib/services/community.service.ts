import { prisma } from '@/lib/prisma';

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

export async function createPost(userId: string, content: string) {
  const room = await prisma.communityRoom.findFirst();
  if (!room) {
    throw new Error('No community rooms are configured.');
  }
  return prisma.communityPost.create({
    data: { roomId: room.id, userId, content },
  });
}

export async function getPoll() {
  return {
    id: 0,
    question: 'How do you feel today?',
    options: ['Calm', 'Overwhelmed'],
    createdAt: new Date(),
  };
}

export async function voteInPoll(userId: string, pollId: number, option: string) {
  console.warn(
    "voteInPoll is not implemented on the client bundle; returning a mock result.",
  );
  return { pollId, userId, option, id: `${userId}-${pollId}-${option}` };
}

import { prisma } from '@/lib/prisma';

export async function getThreadsForUser(userId: string) {
  return prisma.messageThread.findMany({
    where: {
      OR: [
        { messages: { some: { senderId: userId } } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createThread(userId: string, otherUserId: string) {
  return prisma.messageThread.create({
    data: {
      title: 'Mentor Thread',
      messages: {
        create: [{ senderId: userId, content: 'Hello from TMBC', createdAt: new Date() }],
      },
    },
    include: { messages: true },
  });
}

export async function getMessages(threadId: number) {
  return prisma.message.findMany({
    where: { threadId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function sendMessage(userId: string, threadId: number, content: string) {
  return prisma.message.create({
    data: {
      threadId,
      senderId: userId,
      content,
    },
  });
}

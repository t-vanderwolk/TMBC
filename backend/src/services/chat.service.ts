import { Prisma, Role } from '@prisma/client';

import { prisma } from '../../prisma/client';

export type ChatMessagePayload = {
  id: string;
  mentorId: string;
  memberId: string;
  senderId: string;
  senderRole: string;
  senderName: string | null;
  content: string;
  createdAt: string;
};

export type ConversationSummary = {
  threadId: string;
  mentorId: string;
  memberId: string;
  lastMessage: string;
  updatedAt: string;
};

interface CreateChatMessageInput {
  mentorId: string;
  memberId: string;
  senderId: string;
  senderRole: Role;
  content: string;
}

const mapMessage = (
  message: Prisma.ChatMessageGetPayload<{
    include: { sender: { select: { id: true; name: true } } };
  }>,
): ChatMessagePayload => ({
  id: message.id,
  mentorId: message.mentorId,
  memberId: message.memberId,
  senderId: message.senderId,
  senderRole: message.senderRole.toLowerCase(),
  senderName: message.sender?.name ?? null,
  content: message.content,
  createdAt: message.createdAt.toISOString(),
});

const buildThreadId = (mentorId: string, memberId: string) => `${mentorId}:${memberId}`;

export const getConversation = async (mentorId: string, memberId: string) => {
  const messages = await prisma.chatMessage.findMany({
    where: { mentorId, memberId },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return messages.map(mapMessage);
};

export const getMentorConversations = async (mentorId: string): Promise<ConversationSummary[]> => {
  const messages = await prisma.chatMessage.findMany({
    where: { mentorId },
    orderBy: { createdAt: 'desc' },
  });

  const seen = new Map<string, ConversationSummary>();
  for (const message of messages) {
    if (seen.has(message.memberId)) continue;
    seen.set(message.memberId, {
      threadId: buildThreadId(message.mentorId, message.memberId),
      mentorId: message.mentorId,
      memberId: message.memberId,
      lastMessage: message.content,
      updatedAt: message.createdAt.toISOString(),
    });
  }

  return Array.from(seen.values());
};

export const createChatMessage = async ({ mentorId, memberId, senderId, senderRole, content }: CreateChatMessageInput) => {
  const message = await prisma.chatMessage.create({
    data: {
      mentorId,
      memberId,
      senderId,
      senderRole,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return mapMessage(message);
};

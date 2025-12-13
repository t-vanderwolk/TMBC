import { ConversationMessage, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ChatParticipant = {
  id: string;
  name?: string | null;
  role?: string | null;
};

export type ChatMessageDTO = {
  id: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderRole: string | null;
  conversationId: string;
  createdAt: Date;
};

export async function getOrCreateConversation(
  userId: string,
  participantIds: string[]
) {
  const allParticipantIds = Array.from(new Set([userId, ...participantIds]));

  if (allParticipantIds.length !== 2) {
    throw new Error("Conversations must include exactly two participants");
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          id: { in: allParticipantIds },
        },
      },
    },
    include: {
      participants: true,
    },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      participants: {
        connect: allParticipantIds.map((id) => ({ id })),
      },
    },
    include: {
      participants: true,
    },
  });
}

export async function getConversationForUser(
  conversationId: string,
  userId: string
) {
  const convo = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { id: userId },
      },
    },
    include: {
      participants: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: true,
        },
      },
    },
  });

  if (!convo) {
    throw new Error("Conversation not found or access denied");
  }

  return convo;
}

export async function sendMessage({
  conversationId,
  senderId,
  content,
}: {
  conversationId: string;
  senderId: string;
  content: string;
}) {
  if (!content.trim()) {
    throw new Error("Message content cannot be empty");
  }

  const isParticipant = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { id: senderId },
      },
    },
  });

  if (!isParticipant) {
    throw new Error("Sender is not a participant in this conversation");
  }

  return prisma.conversationMessage.create({
    data: {
      conversationId,
      senderId,
      content,
    },
    include: {
      sender: true,
    },
  });
}

export async function getMessages(
  conversationId: string,
  userId: string
): Promise<ChatMessageDTO[]> {
  const convo = await getConversationForUser(conversationId, userId);

  return convo.messages.map((m) => toChatMessageDTO(m));
}

export const toChatMessageDTO = (
  message: ConversationMessage & { sender: User | null },
): ChatMessageDTO => ({
  id: message.id,
  content: message.content,
  senderId: message.senderId,
  senderName: message.sender?.name ?? null,
  senderRole: message.sender?.role ?? null,
  conversationId: message.conversationId,
  createdAt: message.createdAt,
});

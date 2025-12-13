import { Role } from "@prisma/client";

import {
  ChatMessageDTO,
  toChatMessageDTO,
} from "@/lib/services/server/chat.service";

export type ParticipantDTO = {
  id: string;
  name: string | null;
  role: Role;
};

export type ChatMessagePayload = {
  id: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderRole: string | null;
  conversationId: string;
  createdAt: string;
};

export type ChatConversationResponse = {
  id: string;
  participants: ParticipantDTO[];
  mentor: ParticipantDTO | null;
  member: ParticipantDTO | null;
  messages: ChatMessagePayload[];
};

const formatParticipant = (participant: {
  id: string;
  name?: string | null;
  role: Role;
}): ParticipantDTO => ({
  id: participant.id,
  name: participant.name ?? null,
  role: participant.role,
});

const formatChatMessage = (message: ChatMessageDTO): ChatMessagePayload => ({
  ...message,
  createdAt: message.createdAt.toISOString(),
});

export const formatConversationResponse = (conversation: {
  id: string;
  participants: { id: string; name?: string | null; role: Role }[];
  messages: Array<Parameters<typeof toChatMessageDTO>[0]>;
}): ChatConversationResponse => {
  const participants = conversation.participants.map(formatParticipant);
  const mentor =
    participants.find((participant) => participant.role === Role.MENTOR) ?? null;
  const member =
    participants.find((participant) => participant.role === Role.MEMBER) ?? null;

  return {
    id: conversation.id,
    participants,
    mentor,
    member,
    messages: conversation.messages.map((message) =>
      formatChatMessage(toChatMessageDTO(message)),
    ),
  };
};

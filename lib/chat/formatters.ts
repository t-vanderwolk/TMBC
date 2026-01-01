import { Role } from "@prisma/client";

import {
  ChatMessageDTO,
  toChatMessageDTO,
} from "@/lib/services/server/chat.service";
import type {
  ChatConversationResponse,
  ChatMessagePayload,
  ParticipantDTO,
} from "@/types/chat";

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
  readAt: message.readAt ? message.readAt.toISOString() : null,
  isSystem: message.isSystem,
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
    mentorId: mentor?.id ?? null,
    memberId: member?.id ?? null,
    messages: conversation.messages.map((message) =>
      formatChatMessage(toChatMessageDTO(message)),
    ),
  };
};

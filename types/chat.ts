export type RoleType = "MEMBER" | "MENTOR" | "ADMIN";

export type ParticipantDTO = {
  id: string;
  name: string | null;
  role: RoleType;
};

export type ChatMessagePayload = {
  id: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderRole: RoleType | null;
  conversationId: string;
  createdAt: string;
  readAt: string | null;
  isSystem: boolean;
};

export type ChatConversationResponse = {
  id: string;
  participants: ParticipantDTO[];
  mentor: ParticipantDTO | null;
  member: ParticipantDTO | null;
  messages: ChatMessagePayload[];
};

export type ConversationSummary = {
  id: string;
  mentor: ParticipantDTO | null;
  member: ParticipantDTO | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  updatedAt: string;
};

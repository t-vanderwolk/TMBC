import apiClient from "@/lib/api/apiClient";
import { getSessionToken } from "@/lib/auth";

const CHAT_BASE = "/chat";

const configWithToken = (token?: string) => {
  const activeToken = token ?? getSessionToken();
  return activeToken ? { headers: { Authorization: `Bearer ${activeToken}` } } : {};
};

export type ChatParticipant = {
  id: string;
  name: string | null;
  role: string;
};

export type ChatMessagePayload = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderRole: string | null;
  createdAt: string;
};

export type ChatConversation = {
  id: string;
  participants: ChatParticipant[];
  mentor: ChatParticipant | null;
  member: ChatParticipant | null;
  messages: ChatMessagePayload[];
};

export type ConversationSummary = {
  threadId: string;
  mentorId: string;
  memberId: string;
  lastMessage: string;
  updatedAt: string;
};

export const getCurrentConversation = (token?: string) =>
  apiClient.get<{ conversation: ChatConversation }>(
    `${CHAT_BASE}/current`,
    configWithToken(token),
  );

export const getConversation = (mentorId: string, memberId: string, token?: string) =>
  apiClient.get<{ conversation: ChatConversation }>(
    `${CHAT_BASE}/${mentorId}/${memberId}`,
    configWithToken(token),
  );

export const getConversations = (token?: string) =>
  apiClient.get<ConversationSummary[]>(
    `${CHAT_BASE}/conversations`,
    configWithToken(token),
  );

export const sendMessage = (
  conversationId: string,
  content: string,
  token?: string,
) =>
  apiClient.post<{ message: ChatMessagePayload }>(
    `${CHAT_BASE}/send`,
    { conversationId, content },
    configWithToken(token),
  );

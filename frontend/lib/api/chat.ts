import apiClient from "./apiClient";
import { getSessionToken } from "@/lib/auth";

const CHAT_BASE = "/api/chat";

type HeadersConfig = {
  headers?: Record<string, string>;
};

const configWithToken = (token?: string): HeadersConfig => {
  const activeToken = token ?? getSessionToken();
  return activeToken ? { headers: { Authorization: `Bearer ${activeToken}` } } : {};
};

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

const parseThreadId = (threadId: string) => {
  const [mentorId, memberId] = threadId.split(":");
  if (!mentorId || !memberId) {
    throw new Error("Invalid thread id");
  }
  return { mentorId, memberId };
};

export const getConversation = (mentorId: string, memberId: string, token?: string) =>
  apiClient.get<ChatMessagePayload[]>(`${CHAT_BASE}/${mentorId}/${memberId}`, configWithToken(token));

export const getCurrentConversation = (token?: string) =>
  apiClient.get<{
    mentorId: string;
    memberId: string;
    messages: ChatMessagePayload[];
  }>(`${CHAT_BASE}/current`, configWithToken(token));

export const getConversations = (token?: string) =>
  apiClient.get<ConversationSummary[]>(`${CHAT_BASE}/conversations`, configWithToken(token));

export const sendMessage = (threadId: string, content: string, token?: string) => {
  const { mentorId, memberId } = parseThreadId(threadId);
  return apiClient.post<ChatMessagePayload>(
    `${CHAT_BASE}/message`,
    { mentorId, memberId, content },
    configWithToken(token),
  );
};

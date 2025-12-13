import apiClient from "./apiClient";

const buildHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export type CommunityPostPayload = {
  roomId: string;
  content: string;
  isAnnouncement?: boolean;
  isPinned?: boolean;
};

export type CommunityReplyPayload = {
  postId: string;
  content: string;
};

export const getCommunityRooms = (token?: string) =>
  apiClient.get("/community/rooms", {
    headers: buildHeaders(token),
  });

export const getCommunityRoom = (id: string, token?: string) =>
  apiClient.get(`/community/rooms/${id}`, {
    headers: buildHeaders(token),
  });

export const createCommunityPost = (payload: CommunityPostPayload, token?: string) =>
  apiClient.post("/community/posts", payload, {
    headers: buildHeaders(token),
  });

export const createCommunityReply = (payload: CommunityReplyPayload, token?: string) =>
  apiClient.post("/community/replies", payload, {
    headers: buildHeaders(token),
  });

export const shareWorkbookReflection = (payload: {
  moduleId: string;
  promptTitle: string;
  response: string;
  section: string;
  anonymous?: boolean;
  workbookEntryId?: string;
}, token?: string) =>
  apiClient.post("/community/workbook/share", payload, {
    headers: buildHeaders(token),
  });

export const getMentorDashboard = (token?: string) =>
  apiClient.get("/mentor/dashboard", {
    headers: buildHeaders(token),
  });

export const getMentorMentees = (token?: string) =>
  apiClient.get("/mentor/mentees", {
    headers: buildHeaders(token),
  });

export const getMentorNotesForMember = (memberId: string, token?: string) =>
  apiClient.get(`/mentor/mentees/${memberId}/notes`, {
    headers: buildHeaders(token),
  });

export const addMentorNote = (memberId: string, payload: object, token?: string) =>
  apiClient.post(`/mentor/mentees/${memberId}/notes`, payload, {
    headers: buildHeaders(token),
  });

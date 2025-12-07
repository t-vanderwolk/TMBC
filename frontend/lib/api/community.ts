import apiClient from "./apiClient";

const buildHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export const getCommunityRooms = (token?: string) =>
  apiClient.get("/api/community/rooms", {
    headers: buildHeaders(token),
  });

export const getCommunityRoom = (id: string, token?: string) =>
  apiClient.get(`/api/community/rooms/${id}`, {
    headers: buildHeaders(token),
  });

export const createCommunityPost = (roomId: string, content: string, token?: string) =>
  apiClient.post(
    `/api/community/rooms/${roomId}/posts`,
    { content },
    {
      headers: buildHeaders(token),
    },
  );

export const getMentorDashboard = (token?: string) =>
  apiClient.get("/api/mentor/dashboard", {
    headers: buildHeaders(token),
  });

export const getMentorMentees = (token?: string) =>
  apiClient.get("/api/mentor/mentees", {
    headers: buildHeaders(token),
  });

export const getMentorNotesForMember = (memberId: string, token?: string) =>
  apiClient.get(`/api/mentor/mentees/${memberId}/notes`, {
    headers: buildHeaders(token),
  });

export const addMentorNote = (memberId: string, payload: object, token?: string) =>
  apiClient.post(`/api/mentor/mentees/${memberId}/notes`, payload, {
    headers: buildHeaders(token),
  });

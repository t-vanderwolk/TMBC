import apiClient from "./apiClient";

export type EventItem = {
  id: string;
  title: string;
  type?: string | null;
  format?: string | null;
  date: string;
  location?: string | null;
  hostName?: string | null;
  description?: string | null;
  status?: string | null;
  rsvpCount?: number;
  userStatus?: string | null;
};

export const getEvents = () => apiClient.get<EventItem[]>("/events");
export const getUpcomingEvents = () =>
  apiClient.get<EventItem[]>("/events", { params: { scope: "upcoming" }, });

export const rsvpToEvent = (eventId: string, status: string) =>
  apiClient.post(`/events/${eventId}/rsvp`, { status });

import apiClient from "./apiClient";

export const getAdminDashboard = (token?: string) =>
  apiClient.get("/api/admin/dashboard", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

export const getAdminUsers = () => apiClient.get("/api/admin/users");
export const updateAdminUser = (id: string, payload: Record<string, any>) =>
  apiClient.patch(`/api/admin/users/${id}`, payload);
export const deleteAdminUser = (id: string) => apiClient.delete(`/api/admin/users/${id}`);

export const getAdminEvents = () => apiClient.get("/api/admin/events");
export const createAdminEvent = (payload: Record<string, any>) =>
  apiClient.post("/api/admin/events", payload);
export const updateAdminEvent = (id: string, payload: Record<string, any>) =>
  apiClient.patch(`/api/admin/events/${id}`, payload);
export const deleteAdminEvent = (id: string) => apiClient.delete(`/api/admin/events/${id}`);

export const getInviteRequests = () => apiClient.get("/api/invite/requests");

export const getAdminWaitlist = () => apiClient.get("/api/admin/waitlist");
export const approveAdminWaitlist = (id: string) =>
  apiClient.post("/api/admin/waitlist/approve", { id });
export const rejectAdminWaitlist = (id: string) =>
  apiClient.post("/api/admin/waitlist/reject", { id });

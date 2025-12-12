import apiClient from "./apiClient";

export const getAdminDashboard = (token?: string) =>
  apiClient.get("/admin/dashboard", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

export const getAdminUsers = () => apiClient.get("/admin/users");
export const updateAdminUser = (id: string, payload: Record<string, any>) =>
  apiClient.patch(`/admin/users/${id}`, payload);
export const deleteAdminUser = (id: string) => apiClient.delete(`/admin/users/${id}`);

export const getAdminEvents = () => apiClient.get("/admin/events");
export const createAdminEvent = (payload: Record<string, any>) =>
  apiClient.post("/admin/events", payload);
export const updateAdminEvent = (id: string, payload: Record<string, any>) =>
  apiClient.patch(`/admin/events/${id}`, payload);
export const deleteAdminEvent = (id: string) => apiClient.delete(`/admin/events/${id}`);

export const getInviteRequests = () => apiClient.get("/invite/requests");

export const getAdminWaitlist = () => apiClient.get("/admin/waitlist");
export const approveAdminWaitlist = (id: string) =>
  apiClient.post("/admin/waitlist/approve", { id });
export const rejectAdminWaitlist = (id: string) =>
  apiClient.post("/admin/waitlist/reject", { id });

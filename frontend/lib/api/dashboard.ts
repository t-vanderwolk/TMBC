import apiClient from "./apiClient";

export const getDashboard = (token?: string) =>
  apiClient.get("/api/dashboard", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

import apiClient from "./apiClient";

export const getDashboard = (token?: string) =>
  apiClient.get("/dashboard", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

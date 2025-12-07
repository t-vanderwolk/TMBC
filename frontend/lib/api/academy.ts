import apiClient from "./apiClient";

const buildHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export const getModulesWithProgress = (token?: string) =>
  apiClient.get("/api/academy/modules", {
    headers: buildHeaders(token),
  });

export const getModuleDetail = (id: string, token?: string) =>
  apiClient.get(`/api/academy/modules/${id}`, {
    headers: buildHeaders(token),
  });

export const completeModule = (id: string, token?: string) =>
  apiClient.post(
    `/api/academy/modules/${id}/complete`,
    {},
    {
      headers: buildHeaders(token),
    },
  );

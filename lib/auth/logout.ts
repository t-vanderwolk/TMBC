"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { clearSession } from "@/lib/auth";

const LOGOUT_ENDPOINT = "/auth/logout";

export async function logout() {
  const response = await api.post(LOGOUT_ENDPOINT);
  if (!response?.data?.success) {
    throw new Error(response?.data?.error || "Unable to log out.");
  }

  clearSession();
}

export function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    await logout();
    router.replace("/login");
  }, [router]);
}

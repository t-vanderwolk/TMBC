"use client";

import { getStoredUser } from "@/lib/auth";
import type { StoredUser } from "@/lib/auth";
import { routeForRole } from "@/lib/auth/routeForRole";

const SESSION_USER_KEY = "tm_user";

export type { StoredUser };

export const saveUser = (user: StoredUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
};

export const loadStoredUser = (): StoredUser | null => getStoredUser();

export function getRoleRedirectPath(role?: string) {
  return routeForRole(role);
}

export function redirectByRole(user?: { role?: string }) {
  return routeForRole(user?.role);
}

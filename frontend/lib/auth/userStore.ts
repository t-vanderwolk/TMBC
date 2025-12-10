"use client";

import { getStoredUser } from "@/lib/auth";
import type { StoredUser } from "@/lib/auth";
import { redirectByRole } from "./redirectByRole";

const SESSION_USER_KEY = "tm_user";

export type { StoredUser };
export { redirectByRole };

export const saveUser = (user: StoredUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
};

export const loadStoredUser = (): StoredUser | null => getStoredUser();

export const getRoleRedirectPath = (role?: string) => redirectByRole(role);

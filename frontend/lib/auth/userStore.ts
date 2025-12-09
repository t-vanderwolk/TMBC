"use client";

import { getStoredUser } from "@/lib/auth";
import type { StoredUser } from "@/lib/auth";

export type { StoredUser };
export { redirectByRole } from "./redirectByRole";

export const loadStoredUser = (): StoredUser | null => getStoredUser();

export const getRoleRedirectPath = (role: string) => {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "MENTOR") return "/mentor/dashboard";
  return "/dashboard";
};

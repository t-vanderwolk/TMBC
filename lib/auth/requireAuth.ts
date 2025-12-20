"use server";

import { redirect } from "next/navigation";

import { PUBLIC_LOGIN_ROUTE } from "@/lib/auth/routeForRole";
import type { SafeUser } from "@/lib/auth/getUser";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function requireAuth(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(PUBLIC_LOGIN_ROUTE);
  }
  return user;
}

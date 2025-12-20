"use server";

import type { SafeUser } from "@/lib/auth/getUser";
import { getUserOrThrow } from "@/lib/auth/getUser";

export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    return await getUserOrThrow();
  } catch {
    return null;
  }
}

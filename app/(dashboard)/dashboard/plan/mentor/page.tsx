"use server";

import { redirect } from "next/navigation";
import { routeForRole } from "@/lib/auth/routeForRole";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function MentorPlanPage() {
  const user = await requireAuth();
  redirect(routeForRole(user.role));
}

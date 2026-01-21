"use server";

import { requireAuth } from "@/lib/auth/requireAuth";
import PlanWorkspace from "@/app/dashboard/plan/PlanWorkspace";

export default async function MemberPlanEntry() {
  const user = await requireAuth();

  return <PlanWorkspace mode="member" viewerId={user.id} memberId={user.id} />;
}

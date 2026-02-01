"use server";

import { requireAuth } from "@/lib/auth/requireAuth";
import PlanWorkspace from "../PlanWorkspace";

export default async function MemberPlanPage() {
  const user = await requireAuth();

  return <PlanWorkspace mode="member" viewerId={user.id} memberId={user.id} />;
}

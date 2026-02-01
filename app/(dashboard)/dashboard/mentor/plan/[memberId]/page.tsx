"use server";

import { requireAuth } from "@/lib/auth/requireAuth";
import PlanWorkspace from "@/app/(dashboard)/dashboard/plan/PlanWorkspace";

type MentorMemberPlanPageProps = {
  params: {
    memberId: string;
  };
};

export default async function MentorMemberPlanPage({ params }: MentorMemberPlanPageProps) {
  const user = await requireAuth();

  return (
    <PlanWorkspace mode="mentor" viewerId={user.id} memberId={params.memberId} />
  );
}

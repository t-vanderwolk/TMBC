"use server";

import PlanWorkspace from "../../plan/PlanWorkspace";

export default async function MemberPlanEntry() {
  return <PlanWorkspace role="member" />;
}

"use server";

import PlanWorkspace from "../../plan/PlanWorkspace";

export default async function MentorPlanEntry() {
  return <PlanWorkspace role="mentor" />;
}

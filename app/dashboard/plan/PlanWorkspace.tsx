"use server";

import { redirect } from "next/navigation";

import BudgetPanel from "./components/BudgetPanel";
import ComparePanel from "./components/ComparePanel";
import CommunityInsightPanel from "./components/CommunityInsightPanel";
import MentorChatPanel from "./components/MentorChatPanel";
import MemberLeftStack from "./components/MemberLeftStack";
import MentorLeftStack from "./components/MentorLeftStack";
import RegistryPanel from "./components/RegistryPanel";
import PlanShell from "./PlanShell";
import { PlanContextProvider } from "./PlanContext";
import { planLoader } from "./planLoader";
import { getUserOrThrow } from "@/lib/auth/getUser";
import type { PlanRole } from "@/types/plan";

type PlanWorkspaceProps = {
  role: PlanRole;
};

export default async function PlanWorkspace({ role }: PlanWorkspaceProps) {
  const user = await getUserOrThrow();
  const normalizedRole = (user.role ?? "MEMBER").toLowerCase() as PlanRole;

  const planContext = await planLoader({
    userId: user.id,
    role: normalizedRole,
    registryId: user.myRegistryRegistryId ?? undefined,
  });

  if (planContext.meta.role !== role) {
    redirect("/dashboard/plan");
  }

  const isMemberRole = planContext.meta.role === "member";

  return (
    <PlanContextProvider value={planContext}>
      <PlanShell
        left={isMemberRole ? <MemberLeftStack /> : <MentorLeftStack />}
        center={
          <div className="space-y-6">
            <RegistryPanel />
            <BudgetPanel editable={planContext.meta.canEdit} />
            <ComparePanel />
          </div>
        }
        right={
          <div className="space-y-6">
            <MentorChatPanel />
            <CommunityInsightPanel />
          </div>
        }
      />
    </PlanContextProvider>
  );
}

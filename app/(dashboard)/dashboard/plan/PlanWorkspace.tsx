"use server";

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

export type PlanWorkspaceProps = {
  mode: "member" | "mentor";
  viewerId: string;
  memberId: string;
};

export default async function PlanWorkspace({ mode, viewerId, memberId }: PlanWorkspaceProps) {
  const normalizedRole = mode === "mentor" ? "MENTOR" : "MEMBER";

  const planContext = await planLoader({
    memberId,
    viewerId,
    role: normalizedRole,
  });

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

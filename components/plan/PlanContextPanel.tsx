import PriceTimingPanel from "@/components/plan/context/PriceTimingPanel";
import ReferenceChecklistPanel from "@/components/plan/context/ReferenceChecklistPanel";
import CoreEssentialsPanel from "@/components/plan/context/CoreEssentialsPanel";
import RegistryReadinessPanel from "@/components/plan/context/RegistryReadinessPanel";
import MentorReviewBadge from "@/components/plan/MentorReviewBadge";

export default function PlanContextPanel() {
  return (
    <aside className="space-y-5">
      <PriceTimingPanel />
      <ReferenceChecklistPanel />
      <CoreEssentialsPanel />
      <RegistryReadinessPanel />
      <MentorReviewBadge state="Not reviewed" />
    </aside>
  );
}

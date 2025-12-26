import { redirect } from "next/navigation";

export default function LegacyRegistryConflictsPage() {
  // Legacy registry route; /dashboard/plan is the canonical destination.
  redirect("/dashboard/plan/conflicts");
}

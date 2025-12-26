import { redirect } from "next/navigation";

export default function LegacyRegistryPage() {
  // Legacy registry route; /dashboard/plan is the canonical destination.
  redirect("/dashboard/plan");
}

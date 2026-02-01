import { redirect } from "next/navigation";

export default function LegacyRegistryCategoryPage() {
  // Legacy registry route; /dashboard/plan is the canonical destination.
  redirect("/dashboard/plan");
}

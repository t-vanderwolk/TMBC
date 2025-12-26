import { redirect } from "next/navigation";

export default function RegistryRedirectPage() {
  // Legacy registry route; /dashboard/plan is the canonical destination.
  redirect("/dashboard/plan");
}

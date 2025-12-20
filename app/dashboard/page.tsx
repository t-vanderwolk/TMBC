import { redirect } from "next/navigation";

import MemberDashboardPage from "@/components/dashboard/member/MemberDashboardPage";
import { routeForRole } from "@/lib/auth/routeForRole";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function DashboardPage() {
  const user = await requireAuth();
  const normalizedRole = user.role?.toLowerCase();

  if (normalizedRole === "admin") {
    redirect(routeForRole("ADMIN"));
  }

  if (normalizedRole === "mentor") {
    redirect(routeForRole("MENTOR"));
  }

  return <MemberDashboardPage />;
}

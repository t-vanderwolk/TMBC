export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { routeForRole } from "@/lib/auth/routeForRole";
import { requireAuth } from "@/lib/auth/requireAuth";

type MentorPlanLayoutProps = {
  children: ReactNode;
};

export default async function MentorPlanLayout({ children }: MentorPlanLayoutProps) {
  const user = await requireAuth();
  const normalizedRole = user.role?.toLowerCase();

  if (normalizedRole === "member") {
    redirect(routeForRole("MEMBER"));
  }

  if (user.role !== "MENTOR") {
    redirect(routeForRole(user.role));
  }

  return (
    <div className="relative pb-12">
      {children}
    </div>
  );
}

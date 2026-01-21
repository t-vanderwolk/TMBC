export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/requireAuth";
import { routeForRole } from "@/lib/auth/routeForRole";
import MemberBottomNav from "@/components/dashboard/member/nav/MemberBottomNav";

type MemberPlanLayoutProps = {
  children: ReactNode;
};

export default async function MemberPlanLayout({ children }: MemberPlanLayoutProps) {
  const user = await requireAuth();

  if (user.role !== "MEMBER") {
    redirect(routeForRole(user.role));
  }

  return (
    <div className="relative pb-[96px]">
      {children}
      <MemberBottomNav />
    </div>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/requireAuth";
import { routeForRole } from "@/lib/auth/routeForRole";
import MemberBottomNav from "@/components/dashboard/member/nav/MemberBottomNav";

type MemberLayoutProps = {
  children: ReactNode;
};

export default async function MemberLayout({ children }: MemberLayoutProps) {
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

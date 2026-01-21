import type { ReactNode } from "react";

import MemberBottomNav from "@/components/dashboard/member/nav/MemberBottomNav";
import MentorBottomNav from "@/components/dashboard/mentor/nav/MentorBottomNav";
import { requireAuth } from "@/lib/auth/requireAuth";

type PlanLayoutProps = {
  children: ReactNode;
};

export default async function PlanLayout({ children }: PlanLayoutProps) {
  const user = await requireAuth();
  const normalizedRole = user.role?.toLowerCase();
  const isMember = normalizedRole === "member";
  const isMentor = normalizedRole === "mentor";

  return (
    <section className="min-h-screen bg-[#FCF9F7] pb-[96px] pt-6">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">{children}</div>
      {isMember && <MemberBottomNav />}
      {isMentor && <MentorBottomNav />}
    </section>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/requireAuth";
import { routeForRole } from "@/lib/auth/routeForRole";

type MentorLayoutProps = {
  children: ReactNode;
};

export default async function MentorLayout({ children }: MentorLayoutProps) {
  const user = await requireAuth();
  const normalizedRole = user.role?.toLowerCase();

  if (normalizedRole === "member") {
    redirect(routeForRole("MEMBER"));
  }

  if (normalizedRole !== "mentor") {
    redirect(routeForRole(user.role));
  }

  return <>{children}</>;
}

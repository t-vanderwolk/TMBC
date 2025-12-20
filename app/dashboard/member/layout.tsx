import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/requireAuth";
import { routeForRole } from "@/lib/auth/routeForRole";

type MemberLayoutProps = {
  children: ReactNode;
};

export default async function MemberLayout({ children }: MemberLayoutProps) {
  const user = await requireAuth();

  if (user.role !== "MEMBER") {
    redirect(routeForRole(user.role));
  }

  return <>{children}</>;
}

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/requireAuth";
import { routeForRole } from "@/lib/auth/routeForRole";

type SettingsLayoutProps = {
  children: ReactNode;
};

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const user = await requireAuth();

  if (user.role !== "MEMBER") {
    redirect(routeForRole(user.role));
  }

  return <>{children}</>;
}

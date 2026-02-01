export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/requireAuth";
import { routeForRole } from "@/lib/auth/routeForRole";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    redirect(routeForRole(user.role));
  }

  return <>{children}</>;
}

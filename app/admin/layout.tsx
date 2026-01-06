export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { ReactNode } from "react";

type AdminAppLayoutProps = {
  children: ReactNode;
};

export default function AdminAppLayout({ children }: AdminAppLayoutProps) {
  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import { redirectByRole } from "@/lib/auth/redirectByRole";

// This layout is now ONLY a redirect shell.
// It immediately sends the user to their correct role dashboard.
export default function DashboardRedirectLayout() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    const dashboard = redirectByRole(user?.role);
    router.replace(dashboard);
  }, [router]);

  return null;
}

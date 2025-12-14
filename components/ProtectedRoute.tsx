"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import { routeForRole, PUBLIC_LOGIN_ROUTE } from "@/lib/auth/routeForRole";

type RoleName = "ADMIN" | "MENTOR" | "MEMBER";

export default function ProtectedRoute({
  allow = ["MEMBER"],
  children,
}: {
  allow?: RoleName[];
  children: ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = getStoredUser();
    if (!stored) {
      setLoading(false);
      Promise.resolve().then(() => router.replace(PUBLIC_LOGIN_ROUTE));
      return;
    }

    const normalizedAllow = (allow || ["MEMBER"]).map((value) =>
      value.toUpperCase(),
    );
    const role = ((stored.role || "MEMBER").toUpperCase() as RoleName);
    if (!normalizedAllow.includes(role)) {
      setLoading(false);
      const redirectPath = routeForRole(role);
      Promise.resolve().then(() => router.replace(redirectPath));
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, [allow, router]);

  if (loading || !authorized) return null;
  return <>{children}</>;
}

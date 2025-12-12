"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import { routeForRole, PUBLIC_LOGIN_ROUTE } from "@/lib/auth/routeForRole";

type RoleName = "ADMIN" | "MENTOR" | "MEMBER";

export const useRequireRole = (allowed: RoleName[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedAllowed = useMemo(
    () => allowed.map((value) => value.toUpperCase() as RoleName),
    [allowed],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = getStoredUser();
    if (!stored) {
      router.replace(PUBLIC_LOGIN_ROUTE);
      return;
    }

    const role = (stored.role ?? "MEMBER").toUpperCase() as RoleName;
    if (!normalizedAllowed.includes(role)) {
      const target = routeForRole(role);
      if (target !== pathname) {
        router.replace(target);
      }
    }
  }, [normalizedAllowed, pathname, router]);
};

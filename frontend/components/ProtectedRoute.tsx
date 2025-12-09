"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getStoredUser } from "@/lib/auth";
import { getRoleRedirectPath } from "@/lib/auth/userStore";

type RoleName = "MEMBER" | "MENTOR" | "ADMIN";

type ProtectedRouteProps = {
  allowedRoles?: RoleName[];
  children: ReactNode;
};

export default function ProtectedRoute({ children, allowedRoles = ["MEMBER"] }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const normalizedRoles = useMemo(
    () => allowedRoles.map((value) => value.toUpperCase() as RoleName),
    [allowedRoles],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = getStoredUser();

    if (!stored) {
      router.replace("/login");
      return;
    }

    const role = (stored.role ?? "MEMBER").toUpperCase() as RoleName;

    if (!normalizedRoles.includes(role)) {
      router.replace(getRoleRedirectPath(role));
      return;
    }

    setIsAuthorized(true);
  }, [normalizedRoles, router]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}

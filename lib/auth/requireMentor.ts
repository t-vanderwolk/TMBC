"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { loadStoredUser } from "./userStore";
import { routeForRole, PUBLIC_LOGIN_ROUTE } from "./routeForRole";
import type { StoredUser } from "@/lib/auth";

type GuardResult = {
  user: StoredUser | null;
  loading: boolean;
};

export const requireMentor = (): GuardResult => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = loadStoredUser();
    if (!stored) {
      router.replace(PUBLIC_LOGIN_ROUTE);
      setLoading(false);
      return;
    }

    if (stored.role !== "MENTOR") {
      router.replace(routeForRole(stored.role));
      setLoading(false);
      return;
    }

    setUser(stored);
    setLoading(false);
  }, [router]);

  return { user, loading };
};

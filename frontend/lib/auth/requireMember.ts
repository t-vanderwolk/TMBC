"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getRoleRedirectPath, loadStoredUser } from "./userStore";
import type { StoredUser } from "@/lib/auth";

type GuardResult = {
  user: StoredUser | null;
  loading: boolean;
};

export const requireMember = (): GuardResult => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = loadStoredUser();
    if (!stored) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    if (stored.role !== "MEMBER") {
      router.replace(getRoleRedirectPath(stored.role));
      setLoading(false);
      return;
    }

    setUser(stored);
    setLoading(false);
  }, [router]);

  return { user, loading };
};

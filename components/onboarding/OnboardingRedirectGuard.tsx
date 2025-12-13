"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { loadStoredUser } from "@/lib/auth/userStore";
import { routeForRole } from "@/lib/auth/routeForRole";

export default function OnboardingRedirectGuard() {
  const router = useRouter();

  useEffect(() => {
    const stored = loadStoredUser();
    if (stored?.onboardingComplete) {
      router.replace(routeForRole(stored.role));
    }
  }, [router]);

  return null;
}

"use client";

import { useEffect } from "react";

import { getRoleRedirectPath } from "@/lib/auth/userStore";

type UserRole = "MEMBER" | "MENTOR" | "ADMIN";

export function useRequireRole(requiredRole: UserRole) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("tm_user");

    // User not logged in → login
    if (!stored) {
      window.location.href = "/login";
      return;
    }

    const parsed = JSON.parse(stored);
    const role = (parsed.role ?? "MEMBER").toUpperCase();

    // Wrong dashboard → route to the correct one
    if (role !== requiredRole) {
      window.location.href = getRoleRedirectPath(role);
    }
  }, [requiredRole]);
}

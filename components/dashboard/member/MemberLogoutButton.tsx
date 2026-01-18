"use client";

import { useCallback, useState } from "react";

import { useLogout } from "@/lib/auth/logout";

export default function MemberLogoutButton() {
  const [loading, setLoading] = useState(false);
  const logout = useLogout();

  const handleLogout = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  }, [loading, logout]);

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-busy={loading}
      className="rounded-[24px] bg-member-accent-primary px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-text-inverse transition duration-200 hover:bg-member-accent-secondary disabled:bg-member-state-disabled disabled:text-member-text-muted"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}

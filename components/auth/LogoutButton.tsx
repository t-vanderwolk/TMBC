"use client";

import { useCallback, useState } from "react";

import { useLogout } from "@/lib/auth/logout";

type LogoutButtonProps = {
  className?: string;
  wrapperClassName?: string;
};

const BASE_BUTTON_CLASSES =
  "rounded-full border border-[#C8A1B4] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#3E2F35] transition hover:border-[#3E2F35] disabled:cursor-wait disabled:opacity-60";

const DEFAULT_WRAPPER_CLASS = "inline-flex flex-col items-end gap-1";

export default function LogoutButton({
  className = "",
  wrapperClassName,
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logout = useLogout();

  const handleClick = useCallback(async () => {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      await logout();
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to log out. Please try again.";
      setError(message);
      console.error("Logout failed", caught);
    } finally {
      setLoading(false);
    }
  }, [loading, logout]);

  return (
    <div className={`${DEFAULT_WRAPPER_CLASS} ${wrapperClassName ?? ""}`}>
      <button
        type="button"
        className={`${BASE_BUTTON_CLASSES} ${className}`}
        disabled={loading}
        aria-busy={loading}
        onClick={handleClick}
      >
        {loading ? "Logging out…" : "Logout"}
      </button>
      {error && (
        <p className="text-[0.6rem] text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

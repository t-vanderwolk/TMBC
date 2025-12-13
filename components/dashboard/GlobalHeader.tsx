"use client";

import { useEffect, useState } from "react";

import LogoutButton from "@/components/auth/LogoutButton";
import { loadStoredUser } from "@/lib/auth/userStore";

export default function GlobalHeader() {
  const [safeName, setSafeName] = useState("Friend");

  useEffect(() => {
    const currentUser = loadStoredUser();
    if (currentUser?.firstName?.trim() || currentUser?.name?.trim()) {
      setSafeName(
        currentUser?.firstName?.trim() ||
          currentUser?.name?.trim() ||
          "Friend",
      );
    }
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-[#EAD4D8]/70 bg-gradient-to-b from-white via-white/80 to-white/60 shadow-[0_24px_40px_rgba(200,161,180,0.2)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">
            Concierge Dashboard
          </p>
          <h1 className="text-2xl font-serif text-[#3E2F35]">
            Welcome back,{" "}
            <span suppressHydrationWarning className="font-semibold text-[#3E2F35]">
              {safeName}
            </span>
            .
          </h1>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

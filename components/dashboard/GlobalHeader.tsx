"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { getStoredUser } from "@/lib/auth";

export default function GlobalHeader() {
  const currentUser = getStoredUser();
  const safeName =
    currentUser?.firstName?.trim() ||
    currentUser?.name?.trim() ||
    "Friend";

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-[#EAD4D8]/70 bg-gradient-to-b from-white via-white/80 to-white/60 shadow-[0_24px_40px_rgba(200,161,180,0.2)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">
            Concierge Dashboard
          </p>
          <h1 className="text-2xl font-serif text-[#3E2F35]">
            Welcome back, {safeName}.
          </h1>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

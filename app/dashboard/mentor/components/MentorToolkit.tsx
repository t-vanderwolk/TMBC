"use client";

import Link from "next/link";

export default function MentorToolkit() {
  return (
    <div className="rounded-2xl border border-[#E3C6D4] bg-white/80 p-6 shadow-sm md:p-8">
      <h2 className="font-serif text-2xl text-[#3E2F35] md:text-3xl">Mentor Toolkit</h2>
      <p className="mt-2 text-sm text-[#3E2F35]/70 md:text-base">
        Quick access to your studio tools.
      </p>

      <div className="mt-6 grid gap-3 text-sm">
        <Link href="/dashboard/mentor/messages" className="text-[#C8A1B4] transition hover:text-[#A77991]">
          → Respond to messages
        </Link>
        <Link href="/dashboard/events" className="text-[#C8A1B4] transition hover:text-[#A77991]">
          → Host a session
        </Link>
        <Link href="/dashboard/member/community" className="text-[#C8A1B4] transition hover:text-[#A77991]">
          → Moderate community rooms
        </Link>
      </div>
    </div>
  );
}

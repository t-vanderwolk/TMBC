"use client";

import Link from "next/link";

export default function MentorToolkit() {
  return (
    <div className="rounded-[2rem] bg-white/80 border border-[#E3C6D4] p-8 shadow-[0_18px_50px_rgba(180,143,164,0.2)]">
      <h2 className="font-serif text-2xl text-[#3E2F35]">Mentor Toolkit</h2>
      <p className="mt-2 text-sm text-[#3E2F35]/70">
        Quick access to your studio tools.
      </p>

      <div className="mt-6 grid gap-4">
        <Link href="/dashboard/messages" className="text-[#C8A1B4] hover:text-[#A77991]">
          → Respond to messages
        </Link>
        <Link href="/dashboard/events" className="text-[#C8A1B4] hover:text-[#A77991]">
          → Host a session
        </Link>
        <Link href="/dashboard/community" className="text-[#C8A1B4] hover:text-[#A77991]">
          → Moderate community rooms
        </Link>
      </div>
    </div>
  );
}

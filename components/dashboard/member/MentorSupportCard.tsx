"use client";

import Link from "next/link";

type MentorSupportCardProps = {
  mentorName?: string | null;
  status?: string | null;
  availability?: string | null;
};

export default function MentorSupportCard({
  mentorName,
  status,
  availability,
}: MentorSupportCardProps) {
  const safeMentor = mentorName?.trim() || "Your mentor";
  const safeStatus =
    status ?? "Jordan is nearby; messages sync when her studio is online.";
  const safeAvailability = availability ?? "See you in messages soon.";

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#E6D3DA] bg-gradient-to-br from-[#FDF7F4] to-[#F9E0E5] p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Mentor support</p>
        <h2 className="text-3xl font-serif text-[#3E2F35] md:text-4xl">{safeMentor}</h2>
      </div>
      <p className="text-sm text-[#3E2F35]/70 leading-relaxed md:text-base">{safeStatus}</p>
      <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">{safeAvailability}</p>
      <Link
        href="/dashboard/member/messages"
        className="mt-2 inline-flex w-full items-center justify-center rounded-2xl border border-[#C8A1B4] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#3E2F35] transition hover:border-[#3E2F35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C8A1B4]"
      >
        Message My Mentor
      </Link>
    </section>
  );
}

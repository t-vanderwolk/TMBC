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
    <section className="rounded-[2.5rem] border border-[#E6D3DA] bg-gradient-to-br from-[#FDF7F4] to-[#F9E0E5] p-6 shadow-[0_20px_60px_rgba(200,161,180,0.18)]">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
        Mentor support
      </p>
      <h2 className="mt-3 text-3xl font-serif text-[#3E2F35]">{safeMentor}</h2>
      <p className="mt-3 text-sm text-[#3E2F35]/70 leading-relaxed">{safeStatus}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">
        {safeAvailability}
      </p>
      <Link
        href="/dashboard/member/messages"
        className="mt-6 inline-flex w-full items-center justify-center rounded-[999px] border border-[#C8A1B4] bg-white px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35] transition hover:border-[#3E2F35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C8A1B4]"
      >
        Message My Mentor
      </Link>
    </section>
  );
}

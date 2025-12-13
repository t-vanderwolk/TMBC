"use client";

import Link from "next/link";

interface CommunityPanelProps {
  title?: string;
  copy?: string;
  href?: string;
  cta?: string;
}

export default function CommunityPanel({
  title = "Community Circles",
  copy = "Stay in rhythm with the studio — mentors, members, and TMBC hosts share stories daily.",
  href = "/dashboard/member/community",
  cta = "Visit community",
}: CommunityPanelProps) {
  return (
    <section className="rounded-3xl border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)]">
      <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">{title}</p>
      <p className="mt-2 text-sm text-[#3E2F35]/70">{copy}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:text-[#B98AA5]"
      >
        {cta} →
      </Link>
    </section>
  );
}

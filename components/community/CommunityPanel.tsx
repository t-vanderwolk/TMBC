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
    <section className="rounded-2xl border border-[#E3C6D4] bg-white/90 p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">{title}</p>
      <p className="mt-2 text-sm text-[#3E2F35]/70 md:text-base">{copy}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-[#FEF8F5] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:border-[#B98AA5] hover:text-[#B98AA5]"
      >
        {cta} →
      </Link>
    </section>
  );
}

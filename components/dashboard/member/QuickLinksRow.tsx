"use client";

import Link from "next/link";

type QuickLink = {
  label?: string | null;
  href?: string | null;
};

type QuickLinksRowProps = {
  links?: QuickLink[] | null;
};

export default function QuickLinksRow({ links }: QuickLinksRowProps) {
  const safeLinks = links?.length
    ? links.filter((link) => link?.href)
    : [
        { label: "Return to Academy", href: "/dashboard/member/learn" },
        { label: "Registry rhythm", href: "/dashboard/plan" },
        { label: "Community studio", href: "/dashboard/member/community" },
      ];

  const displayLinks = safeLinks.length
    ? safeLinks
    : [{ label: "Explore the dashboard", href: "/dashboard" }];

  return (
    <section className="rounded-2xl border border-[#E3D3DA] bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-1 text-sm font-semibold uppercase tracking-[0.45em] text-[#C8A1B4] md:flex-row md:items-center md:justify-between">
        <p>Quick links</p>
        <span className="text-[0.75rem] text-[#3E2F35]/50">Ready when you are</span>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {displayLinks.map((link, index) => (
          <Link
            key={`${link.href ?? "link"}-${index}`}
            href={link.href ?? "/dashboard"}
            className="flex w-full items-center justify-center rounded-2xl border border-[#E1D1D5] bg-[#FEF8F5] px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35] transition hover:border-[#C8A1B4]"
          >
            {link.label ?? "Explore"}
          </Link>
        ))}
      </div>
    </section>
  );
}

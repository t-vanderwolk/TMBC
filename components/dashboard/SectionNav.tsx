"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Learn", href: "/dashboard/member/learn" },
  { label: "Registry", href: "/dashboard/member/registry" },
  { label: "Community", href: "/dashboard/member/community" },
  { label: "Events", href: "/dashboard/member/events" },
];

export default function SectionNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="flex flex-wrap gap-3 rounded-[3rem] border border-[#EAD4D8] bg-white/90 p-3 shadow-[0_10px_40px_rgba(180,143,164,0.2)]">
      {ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] transition ${
              isActive ? "bg-[#C8A1B4]/20 text-[#3E2F35]" : "text-[#3E2F35]/60 hover:bg-[#FFFAF8] hover:text-[#3E2F35]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

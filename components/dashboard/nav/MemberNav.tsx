"use client";

import Link from "next/link";

const MEMBER_NAV = [
  { label: "Home", href: "/dashboard/member" },
  { label: "Academy", href: "/dashboard/member/learn" },
  { label: "Registry", href: "/dashboard/member/registry" },
  { label: "Community", href: "/dashboard/member/community" },
];

export default function MemberNav() {
  return (
    <>
      {MEMBER_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-xl px-4 py-3 text-sm uppercase tracking-[0.25em] hover:bg-[#F4E7EB] transition"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

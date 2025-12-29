"use client";

import Link from "next/link";

const ADMIN_NAV = [
  { label: "Overview", href: "/dashboard/admin" },
  { label: "Blog", href: "/dashboard/admin/blog" },
  { label: "Invites", href: "/dashboard/admin/invites" },
  { label: "Members", href: "/dashboard/admin/members" },
  { label: "Mentors", href: "/dashboard/admin/mentors" },
  { label: "Settings", href: "/dashboard/admin/settings" },
];

export default function AdminNav() {
  return (
    <>
      {ADMIN_NAV.map((item) => (
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

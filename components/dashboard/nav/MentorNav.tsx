"use client";

import Link from "next/link";

const MENTOR_NAV = [
  { label: "Home", href: "/dashboard/mentor" },
  { label: "Members", href: "/dashboard/mentor/members" },
  { label: "Events", href: "/dashboard/mentor/events" },
  { label: "Tasks", href: "/dashboard/mentor/tasks" },
  { label: "Workspace", href: "/dashboard/mentor/workspace" },
];

export default function MentorNav() {
  return (
    <>
      {MENTOR_NAV.map((item) => (
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

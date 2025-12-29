"use client";

import Link from "next/link";

const MENTOR_NAV = [
  { label: "Mentor Home", href: "/dashboard/mentor" },
  { label: "Mentees", href: "/dashboard/mentor/mentees" },
  { label: "Workspace", href: "/dashboard/mentor/workspace", disabled: true },
  { label: "Mentor Circles", href: "/dashboard/mentor/circles" },
  { label: "Messages", href: "/dashboard/mentor/messages" },
  { label: "Content Studio", href: "/dashboard/mentor/blog" },
  { label: "Insights", href: "/dashboard/mentor/insights" },
];

export default function MentorNav() {
  return (
    <>
      {MENTOR_NAV.map((item) =>
        item.disabled ? (
          <span
            key={item.href}
            className="block cursor-not-allowed rounded-xl px-4 py-3 text-sm uppercase tracking-[0.25em] text-[#3E2F35]/40"
            aria-disabled="true"
          >
            {item.label}
          </span>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 text-sm uppercase tracking-[0.25em] hover:bg-[#F4E7EB] transition"
          >
            {item.label}
          </Link>
        ),
      )}
    </>
  );
}

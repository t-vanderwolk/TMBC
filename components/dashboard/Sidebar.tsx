"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  user: {
    role?: string;
  };
};

type NavEntry = {
  href: string;
  label: string;
  disabled?: boolean;
};

const NAV = {
  member: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/member/learn", label: "Academy" },
    { href: "/dashboard/plan", label: "Registry" },
    { href: "/dashboard/member/events", label: "Events" },
    { href: "/dashboard/member/messages", label: "Messages" },
  ] satisfies NavEntry[],
  mentor: [
    { href: "/dashboard/mentor", label: "Mentor Home" },
    { href: "/dashboard/mentor/mentees", label: "Mentees" },
    { href: "/dashboard/mentor/workspace", label: "Workspace", disabled: true },
    { href: "/dashboard/mentor/circles", label: "Mentor Circles" },
    { href: "/dashboard/mentor/messages", label: "Messages" },
    { href: "/dashboard/mentor/blog", label: "Content Studio" },
    { href: "/dashboard/mentor/insights", label: "Insights" },
  ] satisfies NavEntry[],
  admin: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/admin/invites", label: "Invites" },
    { href: "/dashboard/admin/mentors", label: "Mentors" },
    { href: "/dashboard/admin/registry", label: "Registry" },
    { href: "/dashboard/admin/login-events", label: "Login Events" },
    { href: "/dashboard/admin/settings", label: "Settings" },
  ] satisfies NavEntry[],
};

export default function Sidebar({ user }: SidebarProps) {
  const path = usePathname();
  const role = (user?.role ?? "member").toLowerCase();
  const entries = NAV[role as keyof typeof NAV] ?? NAV.member;

  return (
    <aside className="sidebar">
      {entries.map((item) =>
        item.disabled ? (
          <span
            key={item.href}
            className="sidebar-link cursor-not-allowed opacity-40"
            aria-disabled="true"
          >
            {item.label}
          </span>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${path === item.href ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ),
      )}
    </aside>
  );
}

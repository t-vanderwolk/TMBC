"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  user: {
    role?: string;
  };
};

const NAV = {
  member: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/academy", label: "Academy" },
    { href: "/dashboard/registry", label: "Registry" },
    { href: "/dashboard/events", label: "Events" },
    { href: "/dashboard/messages", label: "Messages" },
  ],
  mentor: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/mentor/members", label: "My Members" },
    { href: "/dashboard/mentor/tasks", label: "Tasks" },
    { href: "/dashboard/mentor/journal-review", label: "Journal Review" },
    { href: "/dashboard/mentor/events", label: "Events" },
  ],
  admin: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/admin/invites", label: "Invites" },
    { href: "/dashboard/admin/mentors", label: "Mentors" },
    { href: "/dashboard/admin/registry", label: "Registry" },
    { href: "/dashboard/admin/login-events", label: "Login Events" },
    { href: "/dashboard/admin/settings", label: "Settings" },
  ],
};

export default function Sidebar({ user }: SidebarProps) {
  const path = usePathname();
  const role = (user?.role ?? "member").toLowerCase();
  const entries = NAV[role as keyof typeof NAV] ?? NAV.member;

  return (
    <aside className="sidebar">
      {entries.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-link ${path === item.href ? "active" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}

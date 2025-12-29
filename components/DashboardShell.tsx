"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Role = "MEMBER" | "MENTOR" | "ADMIN";

type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
};

interface DashboardShellProps {
  title: string;
  children: ReactNode;
  role: Role;
}

export default function DashboardShell({ title, children, role }: DashboardShellProps) {
  const navItems: NavItem[] =
    role === "ADMIN"
      ? [
          { label: "Overview", href: "/dashboard/admin" },
          { label: "Mentors", href: "/dashboard/admin/mentors" },
          { label: "Members", href: "/dashboard/admin/members" },
          { label: "Settings", href: "/dashboard/admin/settings" },
        ]
      : role === "MENTOR"
      ? [
          { label: "Mentor Home", href: "/dashboard/mentor" },
          { label: "Mentees", href: "/dashboard/mentor/mentees" },
          { label: "Workspace", href: "/dashboard/mentor/workspace", disabled: true },
          { label: "Mentor Circles", href: "/dashboard/mentor/circles" },
          { label: "Messages", href: "/dashboard/mentor/messages" },
          { label: "Content Studio", href: "/dashboard/mentor/blog" },
          { label: "Insights", href: "/dashboard/mentor/insights" },
        ]
      : [
          { label: "Home", href: "/dashboard/member" },
          { label: "Learn", href: "/dashboard/member/learn" },
          { label: "Registry", href: "/dashboard/plan" },
          { label: "Community", href: "/dashboard/member/community" },
        ];

  return (
    <div className="min-h-screen bg-tmbc-ivory flex">
      <aside className="w-64 bg-white shadow-soft p-6 rounded-r-xl2 border-r border-tmbc-blush/60">
        <h2 className="text-2xl font-playfair text-tmbc-mauve mb-8">{title}</h2>
        <nav className="space-y-3">
          {navItems.map((item) =>
            item.disabled ? (
              <span
                key={item.href}
                className="block px-4 py-3 rounded-xl2 text-tmbc-charcoal/40"
                aria-disabled="true"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 rounded-xl2 hover:bg-tmbc-blush transition text-tmbc-charcoal"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

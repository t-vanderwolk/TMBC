"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Role = "MEMBER" | "MENTOR" | "ADMIN";

interface DashboardShellProps {
  title: string;
  children: ReactNode;
  role: Role;
}

export default function DashboardShell({ title, children, role }: DashboardShellProps) {
  const navItems =
    role === "ADMIN"
      ? [
          { label: "Overview", href: "/dashboard/admin" },
          { label: "Mentors", href: "/dashboard/admin/mentors" },
          { label: "Members", href: "/dashboard/admin/members" },
          { label: "Settings", href: "/dashboard/admin/settings" },
        ]
      : role === "MENTOR"
      ? [
          { label: "Mentor Dashboard", href: "/dashboard/mentor" },
          { label: "Members", href: "/dashboard/mentor/members" },
          { label: "Cohorts", href: "/dashboard/mentor/cohorts" },
          { label: "Tasks", href: "/dashboard/mentor/tasks" },
        ]
      : [
          { label: "Home", href: "/dashboard/member" },
          { label: "Learn", href: "/dashboard/learn" },
          { label: "Registry", href: "/dashboard/registry" },
          { label: "Community", href: "/dashboard/community" },
        ];

  return (
    <div className="min-h-screen bg-tmbc-ivory flex">
      <aside className="w-64 bg-white shadow-soft p-6 rounded-r-xl2 border-r border-tmbc-blush/60">
        <h2 className="text-2xl font-playfair text-tmbc-mauve mb-8">{title}</h2>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-xl2 hover:bg-tmbc-blush transition text-tmbc-charcoal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

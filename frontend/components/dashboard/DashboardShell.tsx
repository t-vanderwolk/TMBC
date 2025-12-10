"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredUser } from "@/lib/auth";

const NAV_CONFIG = {
  MEMBER: [
    { label: "Home", href: "/dashboard/member" },
    { label: "Academy", href: "/dashboard/learn" },
    { label: "Registry", href: "/dashboard/registry" },
    { label: "Community", href: "/dashboard/community" },
    { label: "Messages", href: "/dashboard/messages" },
  ],
  MENTOR: [
    { label: "Home", href: "/dashboard/mentor" },
    { label: "Members", href: "/dashboard/mentor/members" },
    { label: "Events", href: "/dashboard/mentor/events" },
    { label: "Tasks", href: "/dashboard/mentor/tasks" },
    { label: "Workspace", href: "/dashboard/mentor/workspace" },
  ],
  ADMIN: [
    { label: "Home", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Invites", href: "/dashboard/admin/invites" },
    { label: "Waitlist", href: "/dashboard/admin/waitlist" },
    { label: "Settings", href: "/dashboard/admin/settings" },
  ],
} as const;

const NAV_STYLES = "block px-6 py-3 rounded-xl text-sm font-semibold transition";

const isActive = (path: string, current: string) => {
  if (!current) return false;
  return current.startsWith(path);
};

const activeClass = (path: string, current: string) =>
  isActive(path, current) ? "bg-[#F4E7EB] text-[#3E2F35]" : "text-[#3E2F35]/70 hover:text-[#3E2F35]";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const rawPathname = usePathname();
  const pathname = typeof window !== "undefined" ? rawPathname ?? "" : "";
  const user = getStoredUser();
  const role = (user?.role ?? "MEMBER").toUpperCase() as keyof typeof NAV_CONFIG;
  const nav = NAV_CONFIG[role] ?? NAV_CONFIG.MEMBER;

  return (
    <div className="flex min-h-screen bg-[#FFFAF8]">
      <aside className="hidden md:flex w-64 flex-col gap-6 border-r border-[#E8D6DE] bg-white/70 backdrop-blur p-6">
        <h1 className="font-serif text-2xl text-[#3E2F35] tracking-tight">Taylor-Made Baby Co.</h1>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={`${NAV_STYLES} ${activeClass(item.href, pathname)}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-6 py-10">{children}</main>
    </div>
  );
}

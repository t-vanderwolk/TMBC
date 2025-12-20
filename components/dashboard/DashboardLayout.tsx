"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  CalendarDays,
  ClipboardList,
  MessageCircle,
  Shield,
  Settings,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { useLogout } from "@/lib/auth/logout";

export type DashboardRole = "member" | "mentor" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<LucideProps>;
  roles: DashboardRole[];
};

const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
    roles: ["member", "mentor", "admin"],
  },
  {
    label: "Academy",
    href: "/dashboard/learn",
    icon: BookOpen,
    roles: ["member", "mentor"],
  },
  {
    label: "Registry",
    href: "/dashboard/plan",
    icon: ClipboardList,
    roles: ["member", "mentor"],
  },
  {
    label: "Community",
    href: "/dashboard/community",
    icon: MessageCircle,
    roles: ["member", "mentor"],
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: CalendarDays,
    roles: ["member", "mentor", "admin"],
  },
  {
    label: "Admin",
    href: "/dashboard/admin",
    icon: Shield,
    roles: ["admin"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["member", "mentor", "admin"],
  },
];

type DashboardNavProps = {
  items: NavItem[];
};

const navLinkBase =
  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal";

function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${navLinkBase} ${
              isActive
                ? "border-l-4 border-gold bg-blush text-charcoal shadow-sm"
                : "text-[#3E2F35]/80 hover:bg-[#F6EEF2]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon ? <Icon size={18} className="text-mauve" aria-hidden="true" /> : null}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center gap-2 overflow-x-auto">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-none flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.35em] transition ${
              isActive ? "bg-blush text-charcoal" : "text-[#3E2F35]/70 hover:bg-[#F6EEF2]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon ? <Icon size={18} aria-hidden="true" /> : null}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: DashboardRole;
}) {
  const navItems = DASHBOARD_NAV_ITEMS.filter((item) => item.roles.includes(role));
  const logout = useLogout();

  return (
    <div className="flex min-h-screen bg-ivory text-charcoal">
      <aside className="hidden w-64 flex-none border-r border-[#EAD4D8]/70 bg-white px-4 py-8 shadow-sm md:block">
        <div className="flex h-full flex-col justify-between">
          <DashboardNav items={navItems} />
          <button
            onClick={() => void logout()}
            className="mt-6 rounded-full border border-[#E8D1D9] px-4 py-2 text-sm font-semibold text-[#3E2F35] transition hover:bg-[#F4E6EA]"
          >
            Logout
          </button>
        </div>
      </aside>

      <header className="fixed top-0 z-40 flex h-14 w-full items-center border-b border-[#EAD4D8]/70 bg-white/95 px-4 py-2 shadow-sm md:hidden">
        <div className="flex flex-1 items-center gap-2">
          <MobileNav items={navItems} />
        </div>
        <button
          onClick={() => void logout()}
          className="rounded-full border border-[#E8D1D9] px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35] transition hover:bg-[#F4E6EA]"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 px-4 pb-10 pt-20 md:pt-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

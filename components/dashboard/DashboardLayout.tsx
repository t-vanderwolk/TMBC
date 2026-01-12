"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Compass,
  Home,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  LifeBuoy,
  MessageCircle,
  Users,
  BarChart3,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { useLogout } from "@/lib/auth/logout";

export type DashboardRole = "member" | "mentor" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<LucideProps>;
  disabled?: boolean;
};

const MEMBER_NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/dashboard/member",
    icon: Home,
  },
  {
    label: "Plan",
    href: "/dashboard/plan",
    icon: ClipboardList,
  },
  {
    label: "Learn",
    href: "/dashboard/member/learn",
    icon: BookOpen,
  },
  {
    label: "Community",
    href: "/dashboard/member/community",
    icon: MessageCircle,
  },
  {
    label: "Support",
    href: "/dashboard/member/support",
    icon: LifeBuoy,
  },
];

const MENTOR_NAV_ITEMS: NavItem[] = [
  {
    label: "Mentor Home",
    href: "/dashboard/mentor",
    icon: Compass,
  },
  {
    label: "Mentees",
    href: "/dashboard/mentor/mentees",
    icon: Users,
  },
  {
    label: "Workspace",
    href: "/dashboard/mentor/workspace",
    icon: ClipboardCheck,
    disabled: true,
  },
  {
    label: "Mentor Circles",
    href: "/dashboard/mentor/circles",
    icon: CalendarDays,
  },
  {
    label: "Messages",
    href: "/dashboard/mentor/messages",
    icon: MessageCircle,
  },
  {
    label: "Content Studio",
    href: "/dashboard/mentor/blog",
    icon: BookOpen,
  },
  {
    label: "Insights",
    href: "/dashboard/mentor/insights",
    icon: BarChart3,
  },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/dashboard/admin",
  },
  {
    label: "Blog controls",
    href: "/dashboard/admin#blog-controls",
  },
  {
    label: "Waitlist",
    href: "/dashboard/admin/waitlist",
  },
  {
    label: "Members",
    href: "/dashboard/admin/users",
  },
  {
    label: "Mentors",
    href: "/dashboard/admin/mentors",
  },
  {
    label: "Registry Intelligence",
    href: "/dashboard/admin/registry",
  },
  {
    label: "Affiliates",
    href: "/dashboard/admin/affiliates",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
  },
];

type DashboardNavProps = {
  items: NavItem[];
  showIcons?: boolean;
  onLogout?: () => void;
};

// Navigation is portal-specific.
// Avoid global abstractions.
function PortalNavMenu({ items, onLogout }: DashboardNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeItem =
    items.find((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)) ??
    items[0];

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl bg-transparent px-0 py-2 text-sm font-semibold text-[#3E2F35]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex-1 text-center text-sm font-semibold text-[#3E2F35]/80">
          {activeItem?.label ?? "Menu"}
        </span>
        <span className="text-xl">☰</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl bg-white shadow-[0_20px_40px_rgba(62,47,53,0.12)]">
          <nav className="py-2">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              if (item.disabled) {
                return (
                  <div
                    key={item.href}
                    className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#3E2F35]/40"
                    aria-disabled="true"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs uppercase tracking-[0.3em]">Select mentee</span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-semibold ${
                    isActive ? "bg-[#F6EEF2] text-[#3E2F35]" : "text-[#3E2F35]/80"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {isActive ? <span className="text-xs uppercase tracking-[0.3em]">Current</span> : null}
                </Link>
              );
            })}
            {onLogout ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#3E2F35]/80"
              >
                <span>Log out</span>
              </button>
            ) : null}
          </nav>
        </div>
      )}
    </div>
  );
}

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: DashboardRole;
}) {
  // TMBC UX Canon:
  // Mobile-first. Calm. Contextual navigation.
  // No top navbar.
  // TODO: If a mobile bottom nav is introduced, use Home | Mentees | Workspace | Messages | More.
  const navItems =
    role === "mentor"
      ? MENTOR_NAV_ITEMS
      : role === "admin"
        ? ADMIN_NAV_ITEMS
        : MEMBER_NAV_ITEMS;
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <main className="px-4 pb-12 pt-6 sm:px-6 md:pt-10">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          {/* TMBC UX Canon:
              No global top navbar.
              Navigation is contextual and calm. */}
          <section className="rounded-3xl bg-white/90 p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <PortalNavMenu items={navItems} onLogout={() => void logout()} />
            </div>
          </section>
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}

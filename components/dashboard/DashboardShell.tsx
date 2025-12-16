"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import GlobalHeader from "./GlobalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import { BarChart2, BookOpen, Home, MessageCircle, Sparkles, Users, type LucideProps } from "lucide-react";

export type DashboardRole = "MEMBER" | "MENTOR" | "ADMIN";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const iconForLucide = (Icon?: React.ComponentType<LucideProps>) =>
  Icon ? <Icon size={18} className="text-[#C8A1B4]" /> : <span className="inline-block h-4 w-4 rounded-full bg-[#C8A1B4]/40" aria-hidden />;

const emojiIcon = (symbol: string) => (
  <span className="text-xl text-[#C8A1B4]" aria-hidden="true">
    {symbol}
  </span>
);

const NAV_ITEMS: Record<DashboardRole, NavItem[]> = {
  MEMBER: [
    { href: "/dashboard/member", label: "Home", icon: iconForLucide(Home) },
    { href: "/dashboard/member/learn", label: "Academy", icon: iconForLucide(BookOpen) },
    { href: "/dashboard/member/registry", label: "Registry", icon: iconForLucide(Sparkles) },
    { href: "/dashboard/member/events", label: "Events", icon: emojiIcon("📅") },
    { href: "/dashboard/member/messages", label: "Messages", icon: iconForLucide(MessageCircle) },
    { href: "/dashboard/member/journal", label: "Journal", icon: emojiIcon("✍️") },
    { href: "/dashboard/member/support", label: "Support", icon: emojiIcon("🛟") },
    { href: "/dashboard/member/community", label: "Community", icon: iconForLucide(Users) },
  ],
  MENTOR: [
    { href: "/dashboard/mentor", label: "Studio", icon: iconForLucide(Home) },
    { href: "/dashboard/mentor/messages", label: "Messages", icon: iconForLucide(MessageCircle) },
    { href: "/dashboard/events", label: "Events", icon: iconForLucide(Sparkles) },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: iconForLucide(Home) },
    { href: "/dashboard/users", label: "Users", icon: iconForLucide(Users) },
    { href: "/dashboard/events", label: "Events", icon: iconForLucide(Sparkles) },
    { href: "/dashboard/analytics", label: "Analytics", icon: iconForLucide(BarChart2) },
  ],
};

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: DashboardRole;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const nav = NAV_ITEMS[role] || NAV_ITEMS.MEMBER;

  const currentLabel = useMemo(
    () => nav.find((item) => pathname === item.href)?.label ?? "Dashboard",
    [nav, pathname],
  );

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-screen bg-[#FDF8F6] text-[#3E2F35]">
      <GlobalHeader className="hidden md:block" />

      <header className="md:hidden sticky top-0 z-30 border-b border-[#EAD4D8]/60 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Dashboard</p>
            <h1 className="text-xl font-serif text-[#3E2F35]">{currentLabel}</h1>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E3D0D7] bg-white shadow-sm transition hover:border-[#C8A1B4]"
            aria-label="Open navigation menu"
          >
            <span className="text-2xl leading-none text-[#3E2F35]">☰</span>
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:flex flex-col w-64 pt-24 pb-12 border-r border-[#EAD4D8]/60 bg-white/70 backdrop-blur-xl shadow-[4px_0_30px_rgba(200,161,180,0.08)]">
          <nav className="mt-10 flex flex-col gap-2 px-6">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl transition
                      ${active
                        ? "bg-[#F8EEF2] border-l-4 border-[#C8A1B4] shadow-[0_4px_14px_rgba(200,161,180,0.2)]"
                        : "hover:bg-[#F5EDF2]"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="text-sm tracking-wide text-[#3E2F35]">
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-6 pt-6">
            <LogoutButton className="w-full text-center" wrapperClassName="items-start" />
          </div>
        </aside>

        <main className="flex-1 pt-32 pb-16 px-4 sm:px-5 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-[#12040a]/40" onClick={closeDrawer} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 w-[min(92vw,320px)] border-r border-[#EAD4D8]/60 bg-white/95 px-5 py-8 shadow-[0_25px_60px_rgba(62,47,53,0.35)] backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Menu</p>
              <button
                type="button"
                onClick={closeDrawer}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E3D0D7] text-[#3E2F35]"
                aria-label="Close navigation menu"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-3">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeDrawer}
                    className={`
                      flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition
                      ${active
                        ? "bg-[#F8EEF2] text-[#3E2F35]"
                        : "bg-white text-[#3E2F35]/90 hover:bg-[#F5EDF2]"
                      }
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 border-t border-[#EAD4D8]/60 pt-6">
              <Link
                href="/dashboard/profile"
                onClick={closeDrawer}
                className="flex items-center gap-3 rounded-2xl border border-[#E5D4DC] bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:border-[#C8A1B4]"
              >
                {Users ? (
                  <Users size={18} className="text-[#C8A1B4]" />
                ) : (
                  <span className="text-[#C8A1B4]">👤</span>
                )}
                Profile
              </Link>
              <div className="mt-4">
                <LogoutButton className="w-full text-center" wrapperClassName="items-start" />
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

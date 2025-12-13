"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import GlobalHeader from "./GlobalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import { BarChart2, BookOpen, Home, MessageCircle, Sparkles, Users } from "lucide-react";

export type DashboardRole = "MEMBER" | "MENTOR" | "ADMIN";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const iconForLucide = (Icon: React.ComponentType<{ size?: number; className?: string }>) => (
  <Icon size={18} className="text-[#C8A1B4]" />
);

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
    { href: "/dashboard/community", label: "Community", icon: iconForLucide(Users) },
  ],
  MENTOR: [
    { href: "/dashboard/mentor", label: "Studio", icon: Home },
    { href: "/dashboard/mentor/messages", label: "Messages", icon: MessageCircle },
    { href: "/dashboard/events", label: "Events", icon: Sparkles },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: Home },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/events", label: "Events", icon: Sparkles },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
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
  const nav = NAV_ITEMS[role] || NAV_ITEMS.MEMBER;

  return (
    <div className="flex min-h-screen bg-[#FDF8F6] text-[#3E2F35]">
      <GlobalHeader />

      <aside className="hidden md:flex flex-col w-64 pt-24 pb-12 border-r border-[#EAD4D8]/60 bg-white/70 backdrop-blur-xl shadow-[4px_0_30px_rgba(200,161,180,0.08)]">
        <nav className="mt-10 flex flex-col gap-2 px-6">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="group">
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition
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
          <LogoutButton
            className="w-full text-center"
            wrapperClassName="items-start"
          />
        </div>
      </aside>

      <main className="flex-1 pt-28 pb-16 px-6">{children}</main>
    </div>
  );
}

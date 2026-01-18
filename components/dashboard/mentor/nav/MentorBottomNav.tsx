"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  BookOpen,
  CalendarDays,
  Home,
  MessageCircle,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/mentor", icon: Home, label: "Dashboard" },
  { href: "/dashboard/mentor/mentees", icon: Users, label: "Mentees" },
  { href: "/dashboard/mentor/circles", icon: CalendarDays, label: "Circles" },
  { href: "/dashboard/mentor/messages", icon: MessageCircle, label: "Messages" },
  { href: "/dashboard/mentor/blog", icon: BookOpen, label: "Studio" },
  { href: "/dashboard/mentor/insights", icon: BarChart2, label: "Insights" },
];

const HIDDEN_PATH_PREFIXES = [
  "/login",
  "/logout",
  "/onboarding",
  "/create-profile",
  "/createprofile",
];

export default function MentorBottomNav() {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <nav
      aria-label="Mentor navigation"
      className="pointer-events-auto fixed inset-x-4 bottom-4 z-50 sm:inset-x-6"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.25rem)" }}
    >
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#EAD4D8] bg-white/90 px-3 py-3 shadow-[0_35px_60px_rgba(62,47,53,0.18)] backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/dashboard/mentor" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-12 w-12 items-center justify-center rounded-[18px] border bg-white/90 text-[#3E2F35]/70 transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C8A1B4] ${
                  isActive
                    ? "border-[#EAD4D8] bg-[#FFFAF8] text-[#A4556A] shadow-[0_15px_30px_rgba(84,35,53,0.15)]"
                    : "border-transparent hover:border-[#EAD4D8]/60 hover:text-[#3E2F35]"
                }`}
              >
                <Icon
                  className={`transition duration-200 ease-out ${
                    isActive ? "scale-110 text-[#A4556A]" : "scale-95 opacity-80"
                  }`}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

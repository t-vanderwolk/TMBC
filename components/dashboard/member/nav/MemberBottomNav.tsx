"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, ClipboardList, Feather, Home, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/member", icon: Home, label: "Dashboard" },
  { href: "/dashboard/member/learn", icon: BookOpenCheck, label: "Learn" },
  { href: "/dashboard/plan", icon: ClipboardList, label: "Plan" },
  { href: "/dashboard/member/community", icon: Users, label: "Community" },
  { href: "/dashboard/member/journal", icon: Feather, label: "Journal" },
];

const HIDDEN_PATH_PREFIXES = [
  "/login",
  "/logout",
  "/onboarding",
  "/create-profile",
  "/createprofile",
];

export default function MemberBottomNav() {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <nav
      aria-label="Member navigation"
      className="pointer-events-auto fixed inset-x-4 bottom-4 z-50 sm:inset-x-6"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.25rem)" }}
    >
      <div className="mx-auto max-w-3xl rounded-3xl border border-member-border-soft bg-member-background-card px-3 py-3 shadow-[0_35px_60px_rgba(62,47,53,0.18)] backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/member" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-12 w-12 items-center justify-center rounded-[18px] border bg-member-background-card text-member-text-secondary transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-member-state-focus ${
                  isActive
                    ? "border-member-border-default/70 bg-member-background-soft text-member-accent-primary shadow-[0_15px_30px_rgba(84,35,53,0.15)]"
                    : "border-transparent bg-member-background-card/80 text-member-text-secondary hover:border-member-border-default/60 hover:text-member-text-primary"
                }`}
              >
                <Icon
                  className={`transition duration-200 ease-out ${
                    isActive ? "scale-110 opacity-100 text-member-accent-primary" : "scale-95 opacity-80 text-member-text-secondary"
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

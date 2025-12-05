"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Auth } from "@/lib/auth.client";

type DashboardNavbarProps = {
  user: {
    name?: string | null;
    firstName?: string | null;
    role?: string | null;
  };
};

const NAV_LINKS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Academy", href: "/dashboard/academy" },
  { label: "Registry", href: "/dashboard/registry" },
  { label: "Events", href: "/dashboard/events" },
  { label: "Community", href: "/dashboard/community" },
];

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const router = useRouter();
  const friendlyName = user?.firstName || user?.name || "Friend";

  const handleLogout = () => {
    Auth.clear();
    router.push("/login");
  };

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar__brand">
        <Link href="/dashboard" className="dashboard-navbar__brand-link">
          <span className="font-script text-2xl text-tmMauve">Taylor-Made</span>
          <span className="font-serif text-[0.6rem] uppercase tracking-[0.3em] text-[#3E2F35]/70">
            Baby Co.
          </span>
        </Link>
        <p className="text-xs text-[#3E2F35]/70">Hello, {friendlyName}</p>
      </div>

      <nav className="dashboard-navbar__nav">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="dashboard-navbar__link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="dashboard-navbar__actions">
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">
          {user?.role ? user.role : "Member"}
        </span>
        <button
          type="button"
          className="dashboard-navbar__logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard" },
  { label: "Learn", href: "/dashboard/learn" },
  { label: "My Registry", href: "/dashboard/registry" },
  { label: "Support Hub", href: "/dashboard/support" },
  { label: "Time Capsule", href: "/dashboard/timecapsule" },
  { label: "Events", href: "/dashboard/events" },
  { label: "Messages", href: "/dashboard/messages" },
  { label: "Community", href: "/dashboard/community" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [logoClicks, setLogoClicks] = useState(0);
  const [message, setMessage] = useState("");
  const lateNightMessage = useMemo(() => {
    if (typeof window === "undefined") return "";
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
      return "Midnight focus? We buffered a peppermint tea for you.";
    }
    return "";
  }, []);

  useEffect(() => {
    if (logoClicks >= 3) {
      setMessage("Registry fairy godmother activated.");
      const handle = setTimeout(() => {
        setLogoClicks(0);
        setMessage("");
      }, 2000);
      return () => clearTimeout(handle);
    }
  }, [logoClicks]);

  const logoText = "Taylor-Made Baby Co.";

  return (
    <div className="flex min-h-screen bg-tmIvory text-tmCharcoal">
      <aside className="hidden w-64 flex-col gap-6 border-r border-[#EAD4D8] bg-[#fff8f6] px-6 py-10 lg:flex">
        <button
          type="button"
          onClick={() => setLogoClicks((count) => count + 1)}
          className="text-left font-script text-2xl uppercase tracking-[0.2em] text-[#B98AA5]"
        >
          {logoText}
        </button>
        {message && <p className="text-xs uppercase tracking-[0.4em] text-[#c7a6c9]">{message}</p>}
        <nav className="space-y-3 text-sm uppercase tracking-[0.35em]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-[1.5rem] border border-transparent px-4 py-2 transition ${
                  isActive ? "bg-[#F6E9E6] text-[#3E2F35]" : "text-[#3E2F35]/80 hover:bg-[#F6E9E6]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-[#EAD4D8] bg-white/80 px-6 py-4 text-xs uppercase tracking-[0.35em] text-[#C7A6C9]">
          {lateNightMessage || "Welcome back. Your mentor is on standby."}
        </header>
        <section className="flex-1 overflow-auto p-6"> {children} </section>
      </main>
    </div>
  );
}

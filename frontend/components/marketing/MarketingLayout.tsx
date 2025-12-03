"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/experience", label: "Experience" },
    { href: "/community", label: "Community" },
    { href: "/membership", label: "Membership" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="bg-[#FFFAF8] min-h-screen text-[#3E2F35]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-[#D9C48E]/30">
        <nav className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            Taylor-Made Baby Co.
          </Link>

          <div className="hidden md:flex gap-6 text-sm">
            {navLinks.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className={`transition ${
                  pathname === nav.href
                    ? "text-[#C8A1B4] font-semibold"
                    : "hover:text-[#C8A1B4]"
                }`}
              >
                {nav.label}
              </Link>
            ))}
          </div>

          <Link
            href="/request-invite"
            className="rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold text-white tracking-[0.25em]"
          >
            Request Invite
          </Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#D9C48E]/30 py-10 text-center text-sm text-[#3E2F35]/70">
        © {new Date().getFullYear()} Taylor-Made Baby Co. · All rights reserved
      </footer>
    </div>
  );
}

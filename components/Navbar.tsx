"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { greatVibes } from "@/lib/fonts";
import { PUBLIC_LOGIN_ROUTE } from "@/lib/auth/routeForRole";

type NavLink = {
  label: string;
  href: string;
  variant?: "primary" | "text";
};

const PRIMARY_NAV: NavLink[] = [
  { label: "Experience", href: "/experience" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_NAV: NavLink[] = [
  { label: "Experience", href: "/experience" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Request Invite", href: "/request-invite", variant: "primary" },
  { label: "Login", href: PUBLIC_LOGIN_ROUTE, variant: "text" },
];

const linkClassName = (href: string, isActive: boolean) =>
  `relative group transition-colors duration-200 ${
    isActive ? "text-[var(--tmbc-mauve)]" : "text-[var(--tmbc-charcoal)] text-opacity-80 hover:text-[var(--tmbc-mauve)]"
  }`;

const indicatorClassName = (isActive: boolean) =>
  `absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[var(--tmbc-mauve)] transition-transform duration-200 ${
    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
  }`;

const linkPaddingClass = "flex flex-col items-center pb-3";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <header
      className={`sticky top-0 z-50 bg-[var(--tmbc-ivory)]/80 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "shadow-[0_15px_45px_rgba(62,47,53,0.15)]" : "shadow-none"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-screen-xl items-center justify-between gap-6 px-6 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link href="/" className="space-y-1 text-ellipsis whitespace-nowrap">
          <p
            className={`${greatVibes.className} transition-all duration-300 ${
              scrolled ? "text-2xl" : "text-3xl"
            } text-[var(--tmbc-mauve)]`}
          >
            Taylor-Made
          </p>
          <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Baby Co.
          </p>
        </Link>

        <nav className="hidden items-center gap-6 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-80 md:flex">
          {PRIMARY_NAV.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkClassName(link.href, active)} ${linkPaddingClass}`}
              >
                <span>{link.label}</span>
                <span className={indicatorClassName(active)} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 text-[0.55rem] uppercase tracking-[0.35em] md:flex">
          <Link
            href={PUBLIC_LOGIN_ROUTE}
            className="text-[var(--tmbc-charcoal)] text-opacity-70 transition hover:text-[var(--tmbc-mauve)]"
          >
            Login
          </Link>
          <Link
            href="/request-invite"
            className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-5 py-2 text-[var(--tmbc-charcoal)] font-semibold tracking-[0.35em] shadow-[0_15px_45px_rgba(212,181,121,0.25)] transition hover:shadow-[0_25px_70px_rgba(212,181,121,0.35)]"
          >
            Request Invite
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-12 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className="block h-[2px] w-full bg-[var(--tmbc-charcoal)]" />
          <span className="block h-[2px] w-full bg-[var(--tmbc-charcoal)]" />
          <span className="block h-[2px] w-full bg-[var(--tmbc-charcoal)]" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="mx-auto flex max-w-screen-xl flex-col gap-4 border-t border-[var(--tmbc-mauve)]/30 px-6 py-6 text-[0.75rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-80">
            <nav className="flex flex-col gap-3">
              {MOBILE_NAV.map((link) =>
                link.variant === "primary" ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="marketing-btn marketing-btn-primary uppercase"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

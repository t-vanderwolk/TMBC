"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { greatVibes } from "@/lib/fonts";
import { PUBLIC_LOGIN_ROUTE } from "@/lib/auth/routeForRole";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Experience", href: "/experience" },
  { label: "Community", href: "/community" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--tmbc-mauve)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 text-[0.55rem] uppercase tracking-[0.35em] md:flex">
          <Link
            href={PUBLIC_LOGIN_ROUTE}
            className="rounded-[999px] border border-[var(--tmbc-mauve)] px-4 py-2 text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-gold)] hover:text-[var(--tmbc-mauve)]"
          >
            Log in
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 transition hover:text-[var(--tmbc-mauve)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-2 text-[0.65rem] tracking-[0.4em]">
              <Link
                href={PUBLIC_LOGIN_ROUTE}
                className="marketing-btn marketing-btn-secondary uppercase"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary uppercase"
                onClick={() => setMenuOpen(false)}
              >
                Request Invite
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

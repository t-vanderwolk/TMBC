"use client";

import Link from "next/link";
import { useState } from "react";
import { MARKETING_PRIMARY_NAV } from "@/components/marketing/marketing-links";

const baseNavText =
  "relative text-[12px] uppercase tracking-[0.28em] text-neutral-600 transition-colors duration-200 hover:text-neutral-900";

export default function MarketingNav() {
  // This component is intentionally presentation-only to remain Turbopack-safe.
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/60 bg-[#fbf7f4]/70 supports-[backdrop-filter]:backdrop-blur supports-[backdrop-filter]:bg-[#fbf7f4]/60 py-2 sm:py-3.5">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-ellipsis whitespace-nowrap pr-6 sm:pr-10 lg:pr-12">
          <div className="text-3xl sm:text-4xl leading-none text-[var(--tmbc-blush-primary)] font-script">
            Taylor-Made
          </div>
          <p className="mt-0 text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-neutral-600 leading-none">
            Baby Co.
          </p>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {MARKETING_PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={baseNavText}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className="text-[12px] tracking-[0.28em] rounded-full border border-[var(--tmbc-mauve)] px-4 py-2 hover:bg-[var(--tmbc-mauve)]/10 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/request-invite"
            className="flex h-10 items-center rounded-full px-5 text-[10px] tracking-[0.32em] uppercase bg-[var(--tmbc-blush-primary)] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)]"
          >
            Request an Invite
          </Link>
        </div>

        <button
          type="button"
          aria-controls="marketing-mobile-menu"
          aria-expanded={mobileOpen}
          onClick={toggleMobile}
          className="lg:hidden inline-flex items-center justify-center rounded-full border border-[var(--tmbc-charcoal)]/30 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-charcoal)]/60"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
        <div
          id="marketing-mobile-menu"
          className={`lg:hidden mt-3 w-full ${mobileOpen ? "block" : "hidden"}`}
        >
          <div className="grid grid-cols-2 gap-3 text-[0.7rem] uppercase tracking-[0.28em] text-[var(--tmbc-charcoal)]">
            {MARKETING_PRIMARY_NAV.map((link) => (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                className="border border-neutral-200/70 rounded-[28px] px-4 py-2 text-center text-[var(--tmbc-charcoal)] text-opacity-70"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

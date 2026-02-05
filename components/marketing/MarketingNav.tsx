"use client";

import Link from "next/link";
import { useState } from "react";
import { MARKETING_PRIMARY_NAV } from "@/components/marketing/marketing-links";

const baseNavText =
  "relative text-[12px] uppercase tracking-wide text-neutral-600 transition-colors duration-200 hover:text-neutral-900";

export default function MarketingNav() {
  // This component is intentionally presentation-only to remain Turbopack-safe.
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="relative sticky top-0 z-50 border-b border-black/5 bg-[#fbf7f4]/70 supports-[backdrop-filter]:backdrop-blur supports-[backdrop-filter]:bg-[#fbf7f4]/60 py-0.5 sm:py-2">
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
                <Link href={link.href} className={`${baseNavText} tracking-[0.22em]`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-[12px] tracking-[0.28em] rounded-full border border-[var(--tmbc-mauve)] px-4 py-2 transition-colors duration-200 hover:bg-[var(--tmbc-mauve)]/10"
          >
            Login
          </Link>
          <Link
            href="/request-invite"
            className="inline-flex items-center rounded-full bg-[var(--tmbc-blush)]/30 px-5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-blush-primary)] transition hover:bg-[var(--tmbc-blush)]/50"
          >
            Request an Invite
          </Link>
        </div>

        <button
          type="button"
          aria-controls="marketing-mobile-menu"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={toggleMobile}
          className="lg:hidden inline-flex h-12 w-12 min-h-[48px] flex-col items-center justify-center gap-1 rounded-full border border-[var(--tmbc-charcoal)]/30 transition hover:border-[var(--tmbc-charcoal)]/60"
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <span
            aria-hidden
            className={[
              "block h-0.5 w-5 rounded-full bg-[var(--tmbc-charcoal)] transition-all duration-200",
              mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5",
            ].join(" ")}
          />
          <span
            aria-hidden
            className={[
              "block h-0.5 w-5 rounded-full bg-[var(--tmbc-charcoal)] transition-all duration-200",
              mobileOpen ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
          <span
            aria-hidden
            className={[
              "block h-0.5 w-5 rounded-full bg-[var(--tmbc-charcoal)] transition-all duration-200",
              mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5",
            ].join(" ")}
          />
        </button>
      </div>

      {mobileOpen && (
        <div
          id="marketing-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Marketing navigation"
          className="lg:hidden w-full border-t border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <div className="w-full max-w-md px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/70">Navigation</p>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="min-h-[48px] inline-flex items-center justify-center px-3 text-[12px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70 transition hover:text-[var(--tmbc-charcoal)]"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-3 text-[0.8rem] uppercase tracking-[0.28em] text-[var(--tmbc-charcoal)]">
              {MARKETING_PRIMARY_NAV.map((link) => (
                <Link
                  key={`mobile-${link.href}`}
                  href={link.href}
                  className="rounded-[28px] border border-neutral-200/70 px-4 py-3 text-center text-[var(--tmbc-charcoal)] text-opacity-80 transition hover:text-opacity-100"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <Link
                href="/login"
                className="rounded-full border border-[var(--tmbc-mauve)] px-4 py-2 text-center uppercase tracking-[0.32em] text-[var(--tmbc-charcoal)] text-opacity-80 transition hover:text-[var(--tmbc-charcoal)]/100"
                onClick={closeMobile}
              >
                Login
              </Link>
              <Link
                href="/request-invite"
                className="rounded-full bg-[var(--tmbc-blush)]/30 px-5 py-2 text-center text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-blush-primary)] transition hover:bg-[var(--tmbc-blush)]/50"
                onClick={closeMobile}
              >
                Request an Invite
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

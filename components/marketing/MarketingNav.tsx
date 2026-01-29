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

const baseNavText =
  "relative text-[12px] uppercase tracking-[0.28em] transition-colors duration-200";
const activeUnderline =
  "after:absolute after:left-0 after:-bottom-2 after:h-px after:w-full after:bg-neutral-300";
const subtleNavLink =
  "text-[12px] uppercase tracking-[0.28em] text-neutral-600 transition-colors duration-200 hover:text-neutral-900";

const DesktopLink = ({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: (href: string) => boolean;
}) => {
  const active = isActive(href);
  return (
    <Link
      href={href}
      className={`${baseNavText} ${
        active
          ? `text-neutral-900 ${activeUnderline}`
          : "text-neutral-600 hover:text-neutral-900"
      }`}
    >
      {label}
    </Link>
  );
};

export default function MarketingNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-neutral-200/60 bg-[#fbf7f4]/70 supports-[backdrop-filter]:backdrop-blur supports-[backdrop-filter]:bg-[#fbf7f4]/60 py-2 sm:py-3.5 transition-shadow duration-200 ${
        scrolled ? "shadow-[0_20px_50px_rgba(62,47,53,0.15)]" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-ellipsis whitespace-nowrap pr-6 sm:pr-10 lg:pr-12">
          <p
            className={`${greatVibes.className} text-3xl sm:text-4xl leading-none text-[var(--tmbc-blush-primary)]`}
          >
            Taylor-Made
          </p>
          <p className="mt-0 text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-neutral-600 leading-none">
            Baby Co.
          </p>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <DesktopLink href={link.href} label={link.label} isActive={isActive} />
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={PUBLIC_LOGIN_ROUTE}
            className={`${subtleNavLink} text-[12px] tracking-[0.28em] rounded-full border border-[var(--tmbc-mauve)] px-4 py-2 hover:bg-[var(--tmbc-mauve)]/10 transition-colors duration-200`}
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
        <div className="lg:hidden flex items-center gap-3">
          {/* Mobile-first decluttering keeps just the CTA + menu in view before the overlay opens. */}
          <Link
            href="/request-invite"
            className="flex h-10 items-center rounded-full px-4 text-[10px] tracking-[0.32em] uppercase bg-[var(--tmbc-blush-primary)] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)]"
          >
            Request an Invite
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-12 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className="block h-[2px] w-full bg-[var(--tmbc-charcoal)]" />
          <span className="block h-[2px] w-full bg-[var(--tmbc-charcoal)]" />
          <span className="block h-[2px] w-full bg-[var(--tmbc-charcoal)]" />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden">
          <div className="border-t border-neutral-200/60 px-4 sm:px-6 lg:px-8 py-6">
            <nav className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-80">
              {MOBILE_NAV.map((link) =>
                link.variant === "primary" ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="mkt-btn-primary w-full text-center bg-[var(--tmbc-blush-primary)] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="mkt-link-secondary block"
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
    </nav>
  );
}

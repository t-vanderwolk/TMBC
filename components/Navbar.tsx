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
  isLabel?: boolean;
};

const PRIMARY_NAV: NavLink[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const EXPERIENCE_NAV_ITEMS: NavLink[] = [
  { label: "Learn", href: "/learn" },
  { label: "Plan", href: "/plan" },
  { label: "Connect", href: "/connect" },
  { label: "Reflect", href: "/reflect" },
];

const MOBILE_NAV: NavLink[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Experience", href: "/learn", isLabel: true },
  ...EXPERIENCE_NAV_ITEMS,
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Request Invite", href: "/request-invite", variant: "primary" },
  { label: "Login", href: PUBLIC_LOGIN_ROUTE, variant: "text" },
];

const Navbar = () => {
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

  const experienceActive = EXPERIENCE_NAV_ITEMS.some((item) => isActive(item.href));

  const linkClassName = (href: string) =>
    `relative group transition-colors duration-200 ${
      isActive(href)
        ? "text-[var(--tmbc-mauve)]"
        : "text-[var(--tmbc-charcoal)] text-opacity-80 hover:text-[var(--tmbc-mauve)]"
    }`;
  const indicatorClassName = (href: string) =>
    `absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[var(--tmbc-mauve)] transition-transform duration-200 ${
      isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    }`;

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
          {PRIMARY_NAV.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${linkClassName(link.href)} flex flex-col items-center pb-3`}
            >
              <span>{link.label}</span>
              <span className={indicatorClassName(link.href)} />
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className={`relative flex flex-col items-center gap-1 pb-2 text-[0.65rem] uppercase tracking-[0.3em] transition-colors duration-200 ${
                experienceActive
                  ? "text-[var(--tmbc-mauve)]"
                  : "text-[var(--tmbc-charcoal)] text-opacity-80 hover:text-[var(--tmbc-mauve)]"
              }`}
              aria-haspopup="menu"
            >
              <span>Experience</span>
              <span
                className={`absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[var(--tmbc-mauve)] transition-transform duration-200 ${
                  experienceActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
            <div className="absolute left-0 top-full mt-3 hidden flex-col gap-2 rounded-[26px] border border-[#C8A1B4]/50 bg-[#FFF9F5] p-4 text-left text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] shadow-[0_15px_40px_rgba(199,166,199,0.25)] group-hover:flex group-focus-within:flex group-hover:shadow-[0_25px_70px_rgba(199,166,199,0.35)] ring-1 ring-[var(--tmbc-mauve)]/20">
              {EXPERIENCE_NAV_ITEMS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-[var(--tmbc-mauve)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {PRIMARY_NAV.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${linkClassName(link.href)} flex flex-col items-center pb-3`}
            >
              <span>{link.label}</span>
              <span className={indicatorClassName(link.href)} />
            </Link>
          ))}
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
                link.isLabel ? (
                  <div
                    key={link.label}
                    className="text-xs uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)] text-opacity-60"
                  >
                    {link.label}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      link.variant === "primary"
                        ? "marketing-btn marketing-btn-primary uppercase"
                        : `block py-2 ${linkClassName(link.href)} ${
                            EXPERIENCE_NAV_ITEMS.some((item) => item.href === link.href)
                              ? "pl-6"
                              : ""
                          }`
                    }
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
};

export default Navbar;

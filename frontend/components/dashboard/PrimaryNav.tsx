import Link from "next/link";
import type { ReactNode } from "react";
import type { Route } from "next";

type NavItem = {
  label: string;
  href: Route;
};

type PrimaryNavProps = {
  navItems: ReadonlyArray<NavItem>;
  showAuthControls: boolean;
  profileMenu: ReactNode | null;
  brandHref: Route;
  ctaLink: { label: string; href: Route };
  showMobileNav?: boolean;
};

const NAV_LINK_CLASSES =
  "text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:text-[#C8A1B4]";
const CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_30px_rgba(200,161,180,0.25)] transition hover:scale-105";
const AUTH_LINK_CLASSES =
  "text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:text-[#C8A1B4]";

export default function PrimaryNav({
  navItems,
  showAuthControls,
  profileMenu,
  brandHref,
  ctaLink,
  showMobileNav = true,
}: PrimaryNavProps) {
  const renderLinks = (isMobile = false) =>
    navItems.map((item) => (
      <Link
        key={item.label}
        href={item.href}
        className={NAV_LINK_CLASSES + (isMobile ? " whitespace-nowrap" : "")}
      >
        {item.label}
      </Link>
    ));

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#D9C48E]/40 bg-[#FFFAF8]/95 shadow backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
        <Link
          href={brandHref}
          className="flex flex-col text-left leading-none"
        >
          <span className="font-script text-2xl text-[#C8A1B4]">TMBC</span>
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-[#3E2F35]">
            Taylor-Made Birth Club
          </span>
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center">
          <nav className="hidden items-center gap-6 md:flex">{renderLinks(false)}</nav>
          {showMobileNav && (
            <nav className="flex items-center gap-4 overflow-x-auto text-[0.55rem] md:hidden">
              {renderLinks(true)}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showAuthControls && (
            <Link href="/login" className={AUTH_LINK_CLASSES}>
              Login
            </Link>
          )}
          {profileMenu ?? (
            <Link href={ctaLink.href} className={CTA_CLASSES}>
              {ctaLink.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

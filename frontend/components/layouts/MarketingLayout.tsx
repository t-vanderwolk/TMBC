import Link from 'next/link';
import type { ReactNode } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Membership', href: '/membership' },
  { label: 'Blog', href: '/blog' },
  { label: 'Request Invite', href: '/request-invite' },
  { label: 'Login', href: '/login' },
];

type MarketingLayoutProps = {
  children: ReactNode;
};

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  return (
    <div className="min-h-screen bg-[var(--tmbc-ivory)]">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[var(--tmbc-blush)] via-[var(--tmbc-ivory)] to-[var(--tmbc-mauve)] px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link href="/" className="flex flex-col text-[var(--tmbc-charcoal)]">
            <span className="font-script text-3xl">TMBC</span>
            <span className="text-xs uppercase tracking-[0.5em]">Taylor-Made Baby Co.</span>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold tracking-[0.2em] text-[var(--tmbc-charcoal)] md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative group">
                {link.label}
                <span className="absolute left-1/2 top-full h-0.5 w-6 -translate-x-1/2 rounded-full bg-[var(--tmbc-gold)] opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/request-invite"
              className="rounded-full border border-[var(--tmbc-charcoal)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:bg-white"
            >
              Request Invite
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-transparent bg-[var(--tmbc-charcoal)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/80"
            >
              Login
            </Link>
          </div>
        </div>
      </header>
      <div className="pt-28">{children}</div>
    </div>
  );
};

export default MarketingLayout;

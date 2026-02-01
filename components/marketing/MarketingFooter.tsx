import Link from "next/link";
import { MARKETING_PRIMARY_NAV } from "@/components/marketing/marketing-links";

const companyLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const supportLinks = [{ label: "Log In", href: "/login" }];

export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-[32px] border border-[var(--member-border-soft)] bg-white px-6 py-10 shadow-[0_20px_60px_rgba(62,47,53,0.12)] lg:px-10 lg:py-12">
      <div className="space-y-10">
        <div className="space-y-3">
          <div>
            <p className="text-3xl leading-none text-[var(--tmbc-blush-primary)] font-script">Taylor-Made</p>
            <p className="mt-0 text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-neutral-600 leading-none">
              Baby Co.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[var(--member-text-secondary)]">
            Thoughtful guidance for modern parenthood—sensible, calm, and always human.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/request-invite"
              className="rounded-full bg-[var(--tmbc-blush-primary)] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)]"
            >
              Request an Invite
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[var(--tmbc-mauve)] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[var(--member-text-secondary)] transition hover:text-[var(--member-text-primary)]"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--member-text-secondary)]/55">Explore</p>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--member-text-secondary)]/80">
            {MARKETING_PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--member-border-soft)] px-4 py-2 uppercase tracking-[0.32em] transition hover:text-[var(--member-text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--member-text-secondary)]/55">Company & Support</p>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--member-text-secondary)]/80">
            {[...companyLinks, ...supportLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--member-border-soft)] px-4 py-2 uppercase tracking-[0.32em] transition hover:text-[var(--member-text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--member-border-soft)] pt-6 text-xs uppercase tracking-[0.32em] text-[var(--member-text-secondary)]/55">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Taylor-Made Baby Co.</span>
          <div className="flex flex-wrap gap-6 text-sm text-[var(--member-text-secondary)]/70">
            <Link href="/privacy" className="transition hover:text-[var(--member-text-primary)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[var(--member-text-primary)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

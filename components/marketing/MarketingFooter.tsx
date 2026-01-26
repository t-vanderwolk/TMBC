import Link from "next/link";

const experienceLinks = [
  { label: "Learn", href: "/learn" },
  { label: "Plan", href: "/plan" },
  { label: "Connect", href: "/connect" },
  { label: "Reflect", href: "/reflect" },
];

const companyLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const supportLinks = [{ label: "Log In", href: "/login" }];

export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 px-10 pb-12 pt-16 shadow-[0_18px_60px_rgba(62,47,53,0.08)]">
      <div className="grid gap-12 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="mkt-h2">Taylor-Made Baby Co.</p>
          <p className="mkt-body">
            Thoughtful guidance for modern parenthood. You don&apos;t have to figure this out alone.
          </p>
        </div>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--tmbc-charcoal)]/55">
              Experience
            </p>
            <div className="flex flex-col gap-2">
              {experienceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--tmbc-charcoal)]/70 transition hover:text-[var(--tmbc-charcoal)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--tmbc-charcoal)]/55">
              Company
            </p>
            <div className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--tmbc-charcoal)]/70 transition hover:text-[var(--tmbc-charcoal)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--tmbc-charcoal)]/55">
            Support
          </p>
          <div className="mt-3 space-y-2">
            {supportLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--tmbc-charcoal)]/70 transition hover:text-[var(--tmbc-charcoal)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--tmbc-charcoal)]/10 pt-6 text-xs uppercase tracking-[0.32em] text-[var(--tmbc-charcoal)]/55">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Taylor-Made Baby Co.</span>
          <div className="flex flex-wrap gap-6 text-sm text-[var(--tmbc-charcoal)]/70">
            <Link href="/privacy" className="transition hover:text-[var(--tmbc-charcoal)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[var(--tmbc-charcoal)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

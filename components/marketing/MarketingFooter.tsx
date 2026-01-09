import Link from "next/link";

const experienceLinks = [
  { label: "Learn", href: "/learn" },
  { label: "Plan", href: "/plan" },
  { label: "Connect", href: "/connect" },
  { label: "Reflect", href: "/reflect" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Journal", href: "/blog" },
];

const supportLinks = [
  { label: "Log In", href: "/login" },
];

export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-[32px] border border-[var(--tmbc-mauve)]/15 bg-[var(--tmbc-ivory)]/80 px-8 pb-12 pt-16 space-y-6 text-[var(--tmbc-charcoal)] sm:pb-14 sm:pt-18 shadow-[0_18px_60px_rgba(62,47,53,0.1)]">
      <div className="grid gap-10 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-serif text-lg text-[var(--tmbc-charcoal)]">Taylor-Made Baby Co.</p>
          <div className="space-y-2 pt-4 text-[0.65rem] text-[var(--tmbc-charcoal)] text-opacity-55">
            <p>Thoughtful guidance for modern parenthood.</p>
            <p>You don&apos;t have to figure this out alone.</p>
            <p>And you don&apos;t have to do it all today.</p>
          </div>
        </div>

        <div className="space-y-5 pt-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Experience
          </p>
          <div className="flex flex-col gap-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
            {experienceLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--tmbc-mauve)]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-5 pt-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Company
          </p>
          <div className="flex flex-col gap-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
            {companyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--tmbc-mauve)]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-5 pt-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Support
          </p>
          <div className="flex flex-col gap-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
            {supportLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--tmbc-mauve)]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-[var(--tmbc-mauve)]/20 pt-7 text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Taylor-Made Baby Co.</span>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="transition hover:text-[var(--tmbc-mauve)]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-[var(--tmbc-mauve)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

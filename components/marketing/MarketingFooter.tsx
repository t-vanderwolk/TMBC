import Link from "next/link";

const experienceLinks = [
  { label: "Learn", href: "/learn" },
  { label: "Plan", href: "/plan" },
  { label: "Connect", href: "/connect" },
  { label: "Reflect", href: "/reflect" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Journal", href: "/blog" },
  { label: "Request an Invite", href: "/request-invite" },
];

const supportLinks = [
  { label: "Log In", href: "/login" },
];

export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-[32px] border border-[var(--tmbc-mauve)]/15 bg-[var(--tmbc-ivory)]/90 px-8 pb-14 pt-20 text-[var(--tmbc-charcoal)] sm:pb-16 sm:pt-20">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <p className="font-serif text-lg text-[var(--tmbc-charcoal)]">Taylor-Made Baby Co.</p>
          <div className="space-y-2 pt-4 text-[0.65rem] text-[var(--tmbc-charcoal)] text-opacity-55">
            <p>Thoughtful guidance for modern parenthood.</p>
            <p>You don&apos;t have to figure this out alone.</p>
            <p>And you don&apos;t have to do it all today.</p>
          </div>
        </div>

        <div className="space-y-5 pt-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
            The Experience
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
            Taylor-Made Baby Co.
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

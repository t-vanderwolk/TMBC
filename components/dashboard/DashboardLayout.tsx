import Link from "next/link";
import { type ReactNode } from "react";

export type DashboardRole = "member" | "mentor" | "admin";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-member-background-page text-member-text-primary">
      <main className="px-4 py-10 sm:px-6 md:py-12">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

type SectionLayoutProps = {
  children: ReactNode;
};

export function SectionLayout({ children }: SectionLayoutProps) {
  return <div className="space-y-8">{children}</div>;
}

type DashboardHubLayoutProps = {
  title: string;
  subtitle?: string;
  description: string;
  heroCopy?: string;
  statusLabel?: string;
  statusDetail?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function DashboardHubLayout({
  title,
  subtitle,
  description,
  heroCopy,
  statusLabel,
  statusDetail,
  actions,
  children,
}: DashboardHubLayoutProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-4 rounded-[28px] border border-member-border-default/70 bg-member-background-card p-8 text-member-text-primary shadow-soft">
        <p className="text-xs uppercase tracking-[0.45em] text-member-accent-secondary">
          {subtitle ?? "Dashboard Hub"}
        </p>
        <h1 className="font-playfair text-4xl text-member-text-primary">{title}</h1>
        <p className="text-sm text-member-text-secondary">{description}</p>
        {heroCopy ? <p className="text-sm text-member-text-secondary">{heroCopy}</p> : null}
        {statusLabel ? (
          <div className="rounded-2xl border border-member-border-soft bg-member-background-soft px-4 py-3 text-[0.8rem] text-member-text-secondary">
            <p className="font-semibold text-member-text-primary">{statusLabel}</p>
            {statusDetail ? (
              <p className="text-xs text-member-text-secondary">{statusDetail}</p>
            ) : null}
          </div>
        ) : null}
        {actions ? (
          <div className="flex flex-wrap gap-3">{actions}</div>
        ) : null}
      </header>
      {children}
    </div>
  );
}

type DashboardHubCardProps = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  progress?: number;
  status?: string;
  statusSecondary?: string;
};

export function DashboardHubCard({
  title,
  description,
  href,
  ctaLabel,
  progress,
  status,
  statusSecondary,
}: DashboardHubCardProps) {
  const normalizedProgress =
    progress !== undefined ? Math.min(Math.max(progress, 0), 1) : undefined;

  return (
    <article className="space-y-4 rounded-[28px] border border-member-border-default/60 bg-member-background-card p-6 text-member-text-primary shadow-none">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-member-text-primary">{title}</h2>
        {status ? (
          <span className="text-xs uppercase tracking-[0.35em] text-member-text-secondary/80">
            {status}
          </span>
        ) : null}
      </header>
      <p className="text-sm text-member-text-secondary">{description}</p>
      {normalizedProgress !== undefined ? (
        <div className="space-y-1">
          <div className="h-1.5 rounded-full bg-member-background-muted/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-member-accent-secondary to-member-accent-primary"
              style={{ width: `${normalizedProgress * 100}%` }}
            />
          </div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-member-text-secondary/80">
            {Math.round(normalizedProgress * 100)}% complete
          </p>
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-4 text-xs text-member-text-secondary/70">
        <Link
          href={href}
          className="font-semibold text-member-accent-primary hover:text-member-accent-primary/80 transition-colors"
        >
          {ctaLabel}
        </Link>
        {statusSecondary ? (
          <span className="text-[0.7rem] text-member-text-secondary">{statusSecondary}</span>
        ) : null}
      </div>
    </article>
  );
}

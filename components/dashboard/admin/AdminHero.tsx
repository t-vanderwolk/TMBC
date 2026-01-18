"use client";

type AdminHeroProps = {
  subtext: string;
  email?: string;
};

export default function AdminHero({ subtext, email }: AdminHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-member-border-default bg-gradient-to-br from-member-background-soft via-member-background-card to-member-accent-subtle/80 p-8 shadow-[0_18px_40px_rgba(200,161,180,0.22)]">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-member-accent-secondary">
          Admin control center
        </p>
        <h1 className="text-4xl font-serif text-member-text-primary">Welcome back, Admin</h1>
        <p className="text-sm tracking-[0.1em] text-member-text-secondary">{subtext}</p>
        {email && (
          <p className="text-xs uppercase tracking-[0.3em] text-member-accent-primary/80">
            Signed in as {email}
          </p>
        )}
      </div>
      <div className="pointer-events-none absolute -right-6 bottom-4 h-24 w-24 rounded-full bg-member-accent-secondary/40 blur-3xl" />
    </section>
  );
}

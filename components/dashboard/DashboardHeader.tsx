'use client';

type DashboardHeaderProps = {
  firstName?: string;
  onLogout?: () => void;
};

const DashboardHeader = ({ firstName, onLogout }: DashboardHeaderProps) => {
  const safeName = firstName?.trim() ? firstName.trim() : 'Friend';
  const initials = safeName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-member-background-soft via-member-background-card to-member-accent-subtle/70 px-8 py-6 text-member-text-primary shadow-soft ring-1 ring-white/70 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-script text-3xl text-member-accent-secondary">Taylor-Made</p>
        <p className="font-serif text-xs uppercase tracking-[0.6em] text-member-text-secondary">Baby Co.</p>
      </div>
      <div className="flex flex-col items-start gap-4 text-left md:flex-row md:items-center md:gap-6">
        <div className="text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-member-accent-secondary">Member</p>
          <p className="text-2xl font-semibold text-member-text-primary">Hi, {safeName}!</p>
          <p className="text-sm text-member-text-secondary">Let’s get you ready for baby.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-member-accent-secondary to-member-accent-primary text-lg font-semibold text-member-text-inverse shadow-soft">
            {initials}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-full border border-member-accent-primary bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-member-accent-primary transition hover:bg-member-accent-secondary/80"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

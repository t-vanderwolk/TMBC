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
    <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-white via-tmIvory to-tmBlush/50 px-8 py-6 text-tmCharcoal shadow-soft ring-1 ring-white/70 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-script text-3xl text-tmMauve">Taylor-Made</p>
        <p className="font-serif text-xs uppercase tracking-[0.6em] text-tmCharcoal">
          Baby Co.
        </p>
      </div>
      <div className="flex flex-col items-start gap-4 text-left md:flex-row md:items-center md:gap-6">
        <div className="text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Member</p>
          <p className="text-2xl font-semibold">Hi, {safeName}!</p>
          <p className="text-sm text-tmCharcoal/70">Let’s get you ready for baby.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-tmMauve to-tmBlush text-lg font-semibold text-white shadow-soft">
            {initials}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-full border border-tmMauve bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve transition hover:bg-tmBlush/80"
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

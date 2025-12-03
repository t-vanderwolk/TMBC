"use client";

type TopBarProps = {
  firstName?: string;
  onLogout: () => void;
};

const tagStyles = [
  'border-tmMauve text-tmDeepMauve bg-tmBlush/60',
  'border-tmGold text-tmCharcoal bg-tmGold/30',
  'border-tmCharcoal text-white bg-tmCharcoal/60',
];

export default function TopBar({ firstName, onLogout }: TopBarProps) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-gradient-to-r from-tmBlush/80 via-white to-tmIvory p-6 shadow-editorial">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.5em] text-tmCharcoal/60">Admin cockpit</p>
          <h1 className="text-3xl font-serif text-tmDeepMauve">
            {firstName ? `Hello, ${firstName}` : 'Welcome, Operator'}
          </h1>
          <p className="text-sm text-tmCharcoal/60">
            Curated pulse, activity, and settings for the Taylor-Made community.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-full border border-tmCharcoal/40 bg-tmCharcoal/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-tmCharcoal"
        >
          Sign out
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.35em]">
        {['Blush palette', 'Mauve threads', 'Soft borders'].map((label, index) => (
          <span
            key={label}
            className={`rounded-full border px-3 py-1 text-xs ${tagStyles[index % tagStyles.length]}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

const actions = [
  { label: 'Approve Invites', description: 'Review pending requests' },
  { label: 'Manage Mentors', description: 'Update mentor access' },
  { label: 'View Registry Health', description: 'Spot surprises' },
  { label: 'Edit Branding', description: 'Refresh public feel' },
];

export default function AdminQuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="hover-elevate flex flex-col items-start justify-between rounded-full border border-[var(--tmbc-mauve)] bg-white/80 px-6 py-5 text-left transition-shadow"
        >
          <span className="text-sm font-semibold tracking-[0.3em] text-[var(--tmbc-charcoal)]">
            {action.label}
          </span>
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-gold)]/90">
            {action.description}
          </span>
        </button>
      ))}
    </div>
  );
}

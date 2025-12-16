"use client";

const actions = [
  { label: 'Approve Invites', description: 'Review pending requests' },
  { label: 'Manage Mentors', description: 'Update mentor access' },
  { label: 'View Registry Health', description: 'Spot surprises' },
  { label: 'Edit Branding', description: 'Refresh public feel' },
];

export default function AdminQuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="flex h-full flex-col gap-2 rounded-2xl border border-[var(--tmbc-mauve)] bg-white/80 px-6 py-5 text-left shadow-sm transition hover:border-[var(--tmbc-gold)]"
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

"use client";

type LoginEvent = {
  id: string;
  email: string;
  role?: string | null;
  success: boolean;
  createdAt: string;
};

type AdminRecentLoginsProps = {
  events: LoginEvent[];
  loading: boolean;
};

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export default function AdminRecentLogins({ events, loading }: AdminRecentLoginsProps) {
  if (loading) {
    return (
      <div className="space-y-4 rounded-2xl border border-[#E3C6D4] bg-white/90 p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-mauve)]">Loading login events</p>
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-12 rounded-2xl bg-[var(--tmbc-blush)]/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-2xl border border-[#E3C6D4] bg-white/90 p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-mauve)]">No login activity</p>
        <p className="mt-2 text-xs text-[var(--tmbc-charcoal)] text-opacity-70">
          Invite admins will appear here once they sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const statusClass = event.success ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";
        return (
          <article
            key={event.id}
            className="flex flex-col gap-3 rounded-2xl border border-[#E3C6D4] bg-white/90 p-5 shadow-sm"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">{event.email}</p>
              <span
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.4em] rounded-2xl px-3 py-1 ${statusClass}`}
              >
                {event.success ? "Success" : "Failed"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[var(--tmbc-charcoal)] text-opacity-70 text-xs">
              <span className="uppercase tracking-[0.3em]">{event.role ?? "Member"}</span>
              <span className="text-[var(--tmbc-gold)]">{formatTimestamp(event.createdAt)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

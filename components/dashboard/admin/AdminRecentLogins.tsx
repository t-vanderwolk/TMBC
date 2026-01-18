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
      <div className="space-y-4 rounded-2xl border border-member-border-default bg-member-background-card p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.4em] text-member-text-secondary">Loading login events</p>
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-12 rounded-2xl bg-member-background-soft animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-2xl border border-member-border-default bg-member-background-card p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.4em] text-member-text-secondary">No login activity</p>
        <p className="mt-2 text-xs text-member-text-secondary">
          Invite admins will appear here once they sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const statusClass = event.success
          ? "bg-member-semantic-success/20 text-member-semantic-success"
          : "bg-member-semantic-error/20 text-member-semantic-error";
        return (
          <article
            key={event.id}
            className="flex flex-col gap-3 rounded-2xl border border-member-border-default bg-member-background-card p-5 shadow-sm"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-member-text-primary">{event.email}</p>
              <span
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.4em] rounded-2xl px-3 py-1 ${statusClass}`}
              >
                {event.success ? "Success" : "Failed"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-member-text-secondary">
              <span className="uppercase tracking-[0.3em]">{event.role ?? "Member"}</span>
              <span className="text-member-accent-primary">
                {formatTimestamp(event.createdAt)}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

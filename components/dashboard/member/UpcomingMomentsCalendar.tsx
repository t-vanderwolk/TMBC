type UpcomingMomentsItem = {
  id: string;
  title: string;
  date: string;
  subtitle?: string | null;
};

type UpcomingMomentsCalendarProps = {
  items: UpcomingMomentsItem[];
};

const formatMonthDay = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return 'TBD';
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function UpcomingMomentsCalendar({ items }: UpcomingMomentsCalendarProps) {
  const safeItems = items.slice(0, 3);

  return (
    <section className="space-y-5 rounded-[32px] border border-member-border-default/60 bg-member-background-card p-7 shadow-soft">
      <div className="border-l-4 border-member-accent-secondary pl-4 space-y-1">
        <p className="text-xs uppercase tracking-[0.35em] text-member-accent-secondary">Upcoming Moments</p>
        <h2 className="font-serif text-3xl text-member-text-primary">Your Upcoming Moments</h2>
        <p className="text-sm text-member-text-secondary">
          Trimester shifts, module unlocks, and soft reminders only.
        </p>
      </div>

      {safeItems.length === 0 ? (
        <p className="rounded-2xl border border-member-border-soft bg-member-background-soft px-4 py-6 text-sm text-member-text-secondary">
          Your calendar is intentionally quiet right now.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {safeItems.map((item, index) => (
            <article
              key={item.id}
              className={`group flex flex-col gap-2 rounded-[28px] border border-member-border-soft p-4 shadow-sm transition duration-300 hover:-translate-y-[2px] ${
                index === 0 ? "shadow-[0_20px_40px_rgba(62,47,53,0.1)] bg-member-background-soft" : "opacity-90 bg-member-background-card"
              }`}
            >
              <span className="inline-flex items-center justify-center rounded-full border border-member-border-soft bg-member-background-card px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-member-text-secondary">
                {formatMonthDay(item.date)}
              </span>
              {index === 0 ? (
                <p className="text-[0.55rem] uppercase tracking-[0.4em] text-member-accent-secondary">Up next</p>
              ) : null}
              <p className="text-base font-semibold text-member-text-primary">{item.title}</p>
              {item.subtitle ? (
                <p className="text-sm text-member-text-secondary">{item.subtitle}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-member-text-secondary">
        You were here earlier—this space patiently updates as moments arrive.
      </p>
    </section>
  );
}

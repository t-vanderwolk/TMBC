"use client";

type UpcomingEvent = {
  title?: string | null;
  date?: string | null;
  detail?: string | null;
};

type UpcomingEventsCardProps = {
  events?: UpcomingEvent[] | null;
};

export default function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  const safeEvents = events?.length
    ? events
    : [
        {
          title: "Soothing Studio Session",
          date: "Next Friday · 3:00 PM ET",
          detail: "Gather for guided breathwork + mentor check-in.",
        },
      ];

  return (
    <section className="rounded-2xl border border-[#E3D3DA] bg-[#FEF8F5] p-6 shadow-sm">
      <div className="flex flex-col gap-1 text-sm font-semibold uppercase tracking-[0.45em] text-[#C8A1B4] md:flex-row md:items-center md:justify-between">
        <p>Upcoming events</p>
        <span className="text-[0.75rem] text-[#3E2F35]/60">Calm calendar</span>
      </div>
      <div className="mt-5 grid gap-4">
        {safeEvents.map((event, index) => (
          <article
            key={`event-${event.title ?? index}`}
            className="rounded-2xl bg-white/90 p-4 shadow-sm"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
              {event.date ?? "TBD"}
            </p>
            <h3 className="mt-1 text-xl font-serif text-[#3E2F35] md:text-2xl">
              {event.title ?? "Studio gathering"}
            </h3>
            {event.detail && (
              <p className="mt-2 text-sm text-[#3E2F35]/70 leading-relaxed md:text-base">
                {event.detail}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

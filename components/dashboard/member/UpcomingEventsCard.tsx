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
    <section className="rounded-[2.5rem] border border-[#E3D3DA] bg-[#FEF8F5] p-6 shadow-[0_22px_60px_rgba(200,161,180,0.15)]">
      <div className="flex items-baseline justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
          Upcoming events
        </p>
        <span className="text-[0.65rem] text-[#3E2F35]/60">Calm calendar</span>
      </div>
      <div className="mt-5 space-y-5">
        {safeEvents.map((event, index) => (
          <article key={`event-${event.title ?? index}`} className="rounded-[20px] bg-white/90 p-4 shadow-[0_12px_35px_rgba(200,161,180,0.12)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">
              {event.date ?? "TBD"}
            </p>
            <h3 className="mt-1 text-xl font-serif text-[#3E2F35]">
              {event.title ?? "Studio gathering"}
            </h3>
            {event.detail && (
              <p className="mt-2 text-sm text-[#3E2F35]/70 leading-relaxed">
                {event.detail}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

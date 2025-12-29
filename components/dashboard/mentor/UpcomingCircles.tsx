export type CircleEvent = {
  id: string;
  title: string;
  type: string;
  time: string;
  rsvpCount: number;
};

type UpcomingCirclesProps = {
  events?: CircleEvent[];
  upcomingCount?: number;
  nextSessionAt?: string | Date | null;
};

const formatNextSession = (value?: string | Date | null) => {
  if (!value) return "Next session TBD";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function UpcomingCircles({
  events = [],
  upcomingCount,
  nextSessionAt,
}: UpcomingCirclesProps) {
  if (!events.length && !(upcomingCount && upcomingCount > 0)) {
    return (
      <p className="text-sm text-[#3E2F35]/60">
        No upcoming circles scheduled. This section will populate as sessions are planned.
      </p>
    );
  }

  if (!events.length) {
    return (
      <div className="upcoming-circles">
        <article className="circle-card">
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Upcoming</p>
          <h3 className="mt-1 font-serif text-lg text-[#3E2F35]">Next mentor circle</h3>
          <p className="text-sm text-[#3E2F35]/60">{formatNextSession(nextSessionAt)}</p>
          <p className="text-xs text-[#3E2F35]/60">
            {upcomingCount} upcoming {upcomingCount === 1 ? "circle" : "circles"}
          </p>
        </article>
      </div>
    );
  }

  return (
    <div className="upcoming-circles">
      {events.map((event) => (
        <article key={event.id} className="circle-card">
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
            {event.type}
          </p>
          <h3 className="mt-1 font-serif text-lg text-[#3E2F35]">{event.title}</h3>
          <p className="text-sm text-[#3E2F35]/60">{event.time}</p>
          <p className="text-xs text-[#3E2F35]/60">
            {event.rsvpCount} RSVPs · Open agenda →
          </p>
        </article>
      ))}
    </div>
  );
}

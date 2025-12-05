export type CircleEvent = {
  id: string;
  title: string;
  type: string;
  time: string;
  rsvpCount: number;
};

type UpcomingCirclesProps = {
  events: CircleEvent[];
};

export default function UpcomingCircles({ events }: UpcomingCirclesProps) {
  if (!events.length) {
    return <p className="text-sm text-[#3E2F35]/60">No upcoming circles yet.</p>;
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

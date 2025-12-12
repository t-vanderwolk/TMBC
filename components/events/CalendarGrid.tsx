// TODO: hook to live Prisma data
// TODO: add loading + error states
// TODO: refine design to match TMBC brand
// TODO: connect this CTA to Zoom session
// TODO: add empty-state UX
type CalendarGridEvent = {
  date: string;
  title: string;
  type?: string;
};

const formatKey = (value: Date) => value.toISOString().split('T')[0];

const buildCalendarDays = (reference: Date) => {
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0);
  const totalDays = end.getDate();
  const padding = start.getDay();
  const days = [];

  for (let i = 0; i < padding; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    days.push(new Date(reference.getFullYear(), reference.getMonth(), day));
  }

  return days;
};

type CalendarGridProps = {
  month?: Date;
  events?: CalendarGridEvent[];
};

export function CalendarGrid({ month = new Date(), events = [] }: CalendarGridProps) {
  const days = buildCalendarDays(month);
  const lookup = events.reduce<Record<string, CalendarGridEvent[]>>((acc, event) => {
    const key = event.date.split('T')[0];
    acc[key] = acc[key] || [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-3 rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">
          {month.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <p className="text-sm text-tmCharcoal/60">Drop events into your personal calendar</p>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-wide text-tmCharcoal/60">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <span key={day} className="text-center">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`pad-${idx}`} className="h-20 rounded-xl border border-dashed border-tmBlush/30 bg-tmIvory/40" />;
          }

          const key = formatKey(day);
          const dayEvents = lookup[key] || [];

          return (
            <div key={key} className="flex h-20 flex-col rounded-xl border border-tmBlush/30 bg-tmIvory/60 p-2">
              <p className="text-xs font-semibold text-tmCharcoal">{day.getDate()}</p>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <span key={`${key}-${event.title}`} className="block truncate rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-tmMauve">
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-tmCharcoal/60">+{dayEvents.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-tmCharcoal/50">// TODO: add empty-state UX</p>
    </div>
  );
}

export type { CalendarGridEvent };

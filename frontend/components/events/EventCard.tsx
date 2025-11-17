// TODO: hook to live Prisma data
// TODO: add loading + error states
// TODO: refine design to match TMBC brand
// TODO: connect this CTA to Zoom session
// TODO: add empty-state UX
import { CalendarClock, MapPin, Video } from 'lucide-react';

type EventCardProps = {
  title: string;
  type?: string;
  startTime: string;
  endTime?: string;
  location?: string | null;
  description?: string | null;
  actionLabel?: string;
  highlight?: string;
  onAction?: () => void;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export function EventCard({
  title,
  type = 'COMMUNITY_EVENT',
  startTime,
  endTime,
  location,
  description,
  actionLabel = 'RSVP',
  highlight,
  onAction,
}: EventCardProps) {
  const isVirtual = (type || '').toLowerCase().includes('virtual') || type === 'WORKSHOP';

  return (
    <div className="flex h-full flex-col rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {isVirtual ? (
          <Video className="h-5 w-5 text-tmMauve" />
        ) : (
          <MapPin className="h-5 w-5 text-tmMauve" />
        )}
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">{type}</p>
          <h3 className="text-lg font-semibold text-tmCharcoal">{title}</h3>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-tmCharcoal/80">
        <CalendarClock className="h-4 w-4 text-tmMauve" />
        <span>
          {formatDate(startTime)}
          {endTime ? ` · Ends ${formatDate(endTime)}` : ''}
        </span>
      </div>
      {location && <p className="mt-1 text-sm text-tmCharcoal/70">{location}</p>}
      {description && <p className="mt-3 text-sm text-tmCharcoal/80">{description}</p>}
      {highlight && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve">{highlight}</p>}
      <button
        type="button"
        onClick={onAction}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-tmMauve px-4 py-2 text-sm font-semibold text-tmMauve transition hover:bg-tmMauve/10"
      >
        {actionLabel}
      </button>
      <p className="mt-3 text-xs text-tmCharcoal/50">// TODO: connect this CTA to Zoom session</p>
    </div>
  );
}

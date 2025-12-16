import { CalendarClock, MapPin, Video } from "lucide-react";

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
  className?: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function EventCard({
  title,
  type = "COMMUNITY_EVENT",
  startTime,
  endTime,
  location,
  description,
  actionLabel = "RSVP",
  highlight,
  onAction,
  className = "",
}: EventCardProps) {
  const isVirtual = (type || "").toLowerCase().includes("virtual") || type === "WORKSHOP";
  const eventIcon = isVirtual ? (
    <Video className="h-5 w-5 text-tmMauve" />
  ) : (
    <MapPin className="h-5 w-5 text-tmMauve" />
  );

  return (
    <article
      className={`flex h-full flex-col gap-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {eventIcon}
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-tmMauve">{type}</p>
            <h3 className="text-xl font-serif text-tmCharcoal md:text-2xl">{title}</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-tmCharcoal/80">
          <CalendarClock className="h-4 w-4 text-tmMauve" />
          <span>
            {formatDate(startTime)}
            {endTime ? ` · Ends ${formatDate(endTime)}` : ""}
          </span>
        </div>
        {location && <p className="text-sm text-tmCharcoal/70 md:text-base">{location}</p>}
      </div>
      {description && <p className="text-sm text-tmCharcoal/80 md:text-base">{description}</p>}
      {highlight && (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve">{highlight}</p>
      )}
      <button
        type="button"
        onClick={onAction}
        className="mt-auto inline-flex w-full items-center justify-center rounded-2xl border border-tmMauve px-4 py-2 text-sm font-semibold text-tmMauve transition hover:bg-tmMauve/10"
      >
        {actionLabel}
      </button>
    </article>
  );
}

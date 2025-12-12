import Link from "next/link";

export type EventCardProps = {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  location?: string;
};

export default function EventCard({ id, title, type, date, description, location }: EventCardProps) {
  return (
    <Link
      href={`/dashboard/events/${id}`}
      className="group flex flex-col gap-2 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 text-sm text-[#3E2F35] transition hover:border-[#B98AA5]"
    >
      <div className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">{type}</div>
      <h3 className="text-lg font-semibold text-[#3E2F35]">{title}</h3>
      <p className="text-xs text-[#3E2F35]/70">{new Date(date).toLocaleString()}</p>
      <p className="text-sm text-[#3E2F35]/70">{description}</p>
      {location && <p className="text-xs text-[#3E2F35]/60">{location}</p>}
    </Link>
  );
}

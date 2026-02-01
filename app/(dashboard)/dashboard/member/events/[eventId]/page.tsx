"use server";

import EventCard from "@/components/tmbc/EventCard";
import StyledButton from "@/components/tmbc/StyledButton";
import { fetchEvents, rsvpEvent } from "@/lib/api/placeholders";

async function rsvpEventAction(formData: FormData) {
  const eventId = formData.get("eventId")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "going";
  await rsvpEvent(eventId, status);
  return { success: true };
}

export default async function EventDetailPage({ params }: { params: { eventId: string } }) {
  const events = await fetchEvents();
  const event = events.find((item) => item.id === params.eventId) ?? events[0];

  if (!event) {
    return null;
  }

  return (
    <div className="space-y-6">
      <EventCard
        id={event.id}
        title={event.title}
        type={event.type}
        date={event.date}
        description={event.description}
        location={event.location}
      />
      <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">RSVP</p>
        <form action={rsvpEventAction} className="mt-3 space-y-3">
          <input type="hidden" name="eventId" value={event.id} />
          <button type="submit" name="status" value="going" className="rounded-full bg-tmMauve px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white">
            Going
          </button>
          <button type="submit" name="status" value="interested" className="rounded-full border border-[#E3C6D4] px-6 py-2 text-xs uppercase tracking-[0.4em] text-[#3E2F35]">
            Interested
          </button>
        </form>
      </div>
    </div>
  );
}

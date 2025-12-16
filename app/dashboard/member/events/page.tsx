"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SectionNav from "@/components/dashboard/SectionNav";

import { EventItem, getEvents, rsvpToEvent } from "@/lib/api/events";
import PageHeader from "@/components/dashboard/member/ui/PageHeader";
import CTAButton from "@/components/dashboard/member/ui/CTAButton";
import EmptyState from "@/components/dashboard/member/ui/EmptyState";

type RSVPOption = {
  label: string;
  status: string;
};

const RSVP_OPTIONS: RSVPOption[] = [
  { label: "Going", status: "going" },
  { label: "Interested", status: "interested" },
  { label: "Not Going", status: "not-going" },
];

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getEvents();
      const payload = response.data;
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { events?: EventItem[] })?.events)
          ? (payload as { events?: EventItem[] }).events ?? []
          : [];
      setEvents(items);
    } catch (err) {
      console.error("Unable to load events", err);
      setError("Unable to load events right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEvents();
  }, []);

  const handleRsvp = async (eventId: string, status: string) => {
    setStatusMap((prev) => ({ ...prev, [eventId]: status }));
    try {
      await rsvpToEvent(eventId, status);
      setStatusMap((prev) => ({ ...prev, [eventId]: status }));
    } catch (err) {
      console.error("Unable to register RSVP", err);
      setStatusMap((prev) => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    }
  };

  const upcomingEvents = useMemo(
    () => (Array.isArray(events) ? events.slice(0, 6) : []),
    [events],
  );

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        title="Events & circles"
        subtitle="Soft calendar"
        description="Gentle gatherings, mentor salons, and restorative Q&As—lightly curated for your rhythm."
        cta={{ label: "Back to dashboard", href: "/dashboard/member" }}
      />

      <SectionNav />

      {loading ? (
        <EmptyState title="Hold tight" message="We are gathering the calm calendar for you." />
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : upcomingEvents.length ? (
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const userStatus = statusMap[event.id] ?? event.userStatus ?? "";
            return (
              <article
                key={event.id}
                className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/90 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-1 text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                  <span>{formatDate(event.date)}</span>
                  <span>{event.format ?? event.type ?? "Studio session"}</span>
                </div>
                <h2 className="text-lg font-semibold text-[#3E2F35]">{event.title}</h2>
                <p className="text-sm text-[#3E2F35]/75">{event.description}</p>
                {event.hostName && (
                  <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
                    Hosted by {event.hostName}
                  </p>
                )}
                <div className="space-y-2">
                  {RSVP_OPTIONS.map((option) => {
                    const isActive = userStatus === option.status;
                    return (
                      <CTAButton
                        key={option.status}
                        label={option.label}
                        variant={isActive ? "primary" : "ghost"}
                        fullWidth
                        onClick={() => handleRsvp(event.id, option.status)}
                      />
                    );
                  })}
                  <Link
                    href="/dashboard/member/community"
                    className="text-xs font-semibold uppercase tracking-[0.35em] text-[#B98AA5]"
                  >
                    Explore community
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Calendar is calm"
          message="No events scheduled just yet. Breathe, rest, and check back for mentor-led invitations."
        />
      )}

      <section className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F6] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Event rhythm</p>
        <h2 className="mt-1 text-lg font-serif text-[#3E2F35]">We keep the invitations gentle</h2>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Prioritize one live moment per week, with replays you can watch when the mood strikes.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-[#3E2F35]/75">
          <li>• Trimester-focused Q&As with mentors.</li>
          <li>• Soft labs about gear, sleep, and relationships.</li>
          <li>• Gentle circles for sharing reflections.</li>
        </ul>
        <small className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
          RSVP updates sync quietly with your mentor + registry rhythms.
        </small>
      </section>
    </div>
  );
}

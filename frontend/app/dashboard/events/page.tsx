"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { EventItem, getEvents, rsvpToEvent } from "@/lib/api/events";

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

const statusClass = (isActive: boolean) =>
  isActive
    ? "bg-[rgba(200,161,180,0.3)] text-[#3E2F35] border-transparent"
    : "border border-[#E3C6D4] text-[#3E2F35]/80 hover:border-[#B98AA5]";

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
      setEvents(response.data ?? []);
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

  const upcomingEvents = useMemo(() => events.slice(0, 6), [events]);

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#EAC9D1]/60 bg-white/95 p-8 shadow-[0_24px_55px_rgba(199,166,199,0.18)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-[#3E2F35]/60">
          Events & circles
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[#3E2F35]">
          Your Taylor-Made calendar
        </h1>
        <p className="mt-2 text-sm text-[#3E2F35]/75">
          Gentle classes, mentor salons, and Q&As curated for your trimester and registry rhythm.
        </p>
        <Link
          href="/dashboard"
          className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#C8A1B4] hover:text-[#B98AA5]"
        >
          ← Back to dashboard
        </Link>
      </header>

      {loading ? (
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 text-center text-sm uppercase tracking-[0.4em] text-[#C8A1B4] shadow-[0_20px_60px_rgba(180,143,164,0.25)]">
          Loading events…
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-5">
            {upcomingEvents.map((event) => {
              const userStatus = statusMap[event.id] ?? event.userStatus ?? "";
              return (
                <article
                  key={event.id}
                  className="group rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_45px_rgba(199,166,199,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(199,166,199,0.25)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/55">
                        {event.format ?? event.type ?? "Studio session"}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-[#3E2F35]">
                        {event.title}
                      </h2>
                      <p className="mt-1 text-xs text-[#3E2F35]/65">
                        {formatDate(event.date)}
                      </p>
                      {event.hostName && (
                        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">
                          Hosted by {event.hostName}
                        </p>
                      )}
                    </div>
                    <span
                      className="rounded-full border border-[#E3C6D4] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]"
                    >
                      {event.status ?? "Scheduled"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#3E2F35]/75">{event.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
                    {RSVP_OPTIONS.map((option) => {
                      const isActive = userStatus === option.status;
                      return (
                        <button
                          key={option.status}
                          type="button"
                          onClick={() => handleRsvp(event.id, option.status)}
                          className={`rounded-full px-4 py-2 font-semibold uppercase tracking-[0.3em] ${statusClass(isActive)}`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                    <Link
                      href="/dashboard/community"
                      className="rounded-full border border-[#E3C6D4] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70 hover:border-[#B98AA5]"
                    >
                      Explore community
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4 rounded-[2.2rem] border border-[#E3C6D4] bg-gradient-to-br from-white via-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/45 p-6 shadow-[0_24px_60px_rgba(199,166,199,0.22)]">
            <h2 className="font-serif text-xl text-[#3E2F35]">Event rhythm</h2>
            <p className="text-sm text-[#3E2F35]/70">
              We keep your calendar light: 1–2 live gatherings per week plus replays you can watch on your schedule.
            </p>
            <ul className="space-y-2 text-sm text-[#3E2F35]/75">
              <li>• Trimester-focused Q&A with mentors.</li>
              <li>• Skill labs for car seats, strollers, and nursery setup.</li>
              <li>• Gentle circles on sleep, feeding, and in-law diplomacy.</li>
            </ul>
            <small className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
              RSVP updates sync with your mentor + registry rhythms.
            </small>
          </aside>
        </section>
      )}
    </div>
  );
}

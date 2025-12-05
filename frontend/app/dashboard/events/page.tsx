"use client";

import { useState } from "react";
// If you already have an EventCard component, keep this import
// and ignore the inline card below.
// import EventCard from "@/components/events/EventCard";

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Car Seat Confidence Lab",
    type: "Bespoke · Virtual",
    date: "Thursday · 6:00 PM",
    timezone: "PST",
    host: "Ellie (CPST) + Marisol",
    description:
      "Live demo on buckling, base installs, and what’s actually normal when you leave the hospital.",
    status: "Upcoming",
  },
  {
    id: "2",
    title: "Nursery Flow & Night Feeds",
    type: "Group Circle · Virtual",
    date: "Sunday · 10:30 AM",
    timezone: "PST",
    host: "Taylor-Made Mentor Circle",
    description:
      "Walk through your nursery layout, night-feed stations, and how to keep the room calm at 3 a.m.",
    status: "Waitlist",
  },
  {
    id: "3",
    title: "Fourth Trimester Soft Landing",
    type: "Salon · In Person",
    date: "Next Month · TBA",
    timezone: "Local",
    host: "Lactation + Doula Panel",
    description:
      "A cozy salon on rest, recovery, and how to ask for the help you actually need.",
    status: "Replay available",
  },
];

type EventStatus = "All" | "Upcoming" | "Replay" | "Waitlist";

export default function EventsPage() {
  const [filter, setFilter] = useState<EventStatus>("All");

  const filteredEvents = MOCK_EVENTS.filter((event) => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return event.status === "Upcoming";
    if (filter === "Replay") return event.status.toLowerCase().includes("replay");
    if (filter === "Waitlist") return event.status === "Waitlist";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="rounded-[2.5rem] border border-[var(--tmbc-mauve)]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(199,166,199,0.18)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)]/55">
          Events & circles
        </p>
        <h1 className="mt-3 font-serif text-2xl text-[var(--tmbc-charcoal)] sm:text-3xl">
          Your Taylor-Made calendar
        </h1>
        <p className="mt-2 text-sm text-[var(--tmbc-charcoal)]/75">
          A mix of gentle classes, mentor salons, and Q&A circles curated for your
          trimester and registry rhythm.
        </p>
      </header>

      {/* Filters */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/80 px-5 py-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
            Filter
          </p>
          <p className="text-xs text-[var(--tmbc-charcoal)]/70">
            Peek at what’s coming up or revisit a replay with your tea.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", "Upcoming", "Replay", "Waitlist"] as EventStatus[]).map((option) => {
            const active = filter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={[
                  "rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.32em] transition",
                  active
                    ? "bg-[var(--tmbc-mauve)] text-[var(--tmbc-charcoal)] shadow-[0_10px_35px_rgba(199,166,199,0.45)]"
                    : "border border-[var(--tmbc-mauve)]/40 text-[var(--tmbc-charcoal)]/75 hover:border-[var(--tmbc-gold)]/70 hover:text-[var(--tmbc-charcoal)]",
                ].join(" ")}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      {/* Content */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* Event list */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--tmbc-mauve)]/40 bg-white/70 p-10 text-center">
              <p className="text-sm text-[var(--tmbc-charcoal)]/75">
                No events in this category yet.
              </p>
              <p className="mt-1 text-xs text-[var(--tmbc-charcoal)]/55">
                Your mentor will add events as your journey unfolds.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-[2rem] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-5 shadow-[0_18px_45px_rgba(199,166,199,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(199,166,199,0.25)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/55">
                      {event.type}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-[var(--tmbc-charcoal)]">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--tmbc-charcoal)]/65">
                      {event.date} · {event.timezone}
                    </p>
                    <p className="mt-1 text-xs text-[var(--tmbc-charcoal)]/65">
                      Host: {event.host}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em]",
                      event.status === "Upcoming" &&
                        "bg-[var(--tmbc-mauve)]/15 text-[var(--tmbc-charcoal)]",
                      event.status === "Waitlist" &&
                        "bg-amber-100 text-[var(--tmbc-charcoal)]",
                      event.status.toLowerCase().includes("replay") &&
                        "bg-[var(--tmbc-blush)]/50 text-[var(--tmbc-charcoal)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--tmbc-charcoal)]/75">
                  {event.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
                  <button
                    type="button"
                    className="rounded-full bg-[var(--tmbc-mauve)] px-4 py-2 font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] shadow-[0_10px_35px_rgba(199,166,199,0.4)] transition hover:translate-y-0.5 hover:bg-gradient-to-r hover:from-[var(--tmbc-gold)] hover:to-[var(--tmbc-blush)]"
                  >
                    Save my spot
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--tmbc-mauve)]/60 px-4 py-2 font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/75 transition hover:border-[var(--tmbc-gold)] hover:text-[var(--tmbc-charcoal)]"
                  >
                    Add to calendar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Side summary */}
        <aside className="space-y-4 rounded-[2.2rem] border border-[var(--tmbc-mauve)]/35 bg-gradient-to-br from-white via-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/45 p-6 shadow-[0_24px_60px_rgba(199,166,199,0.22)]">
          <h2 className="font-serif text-xl text-[var(--tmbc-charcoal)]">
            Your event rhythm
          </h2>
          <p className="text-sm text-[var(--tmbc-charcoal)]/75">
            We keep your calendar light: usually **1–2 live events per week**, plus
            replays you can watch in sweats at your own pace.
          </p>
          <ul className="space-y-2 text-sm text-[var(--tmbc-charcoal)]/75">
            <li>• Trimester-focused Q&A with mentors.</li>
            <li>• Skill labs for car seats, strollers, and nursery setup.</li>
            <li>• Gentle circles on sleep, feeding, and in-law diplomacy.</li>
          </ul>
          <div className="mt-3 rounded-2xl bg-white/85 p-4 text-xs text-[var(--tmbc-charcoal)]/75">
            <p className="font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">
              Coming soon
            </p>
            <p className="mt-2">
              Your mentor will soon be able to **add events directly to this view**
              and sync them with your **registry milestones** and **academy progress.**
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
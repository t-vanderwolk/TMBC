"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const phases = [
  {
    title: "Phase 1 · Onboard",
    summary: "Request invite → mentor match → cozy welcome",
    description:
      "We ask about your timing, emotions, and what calm feels like. Then we match you with a mentor circle or 1:1 guide.",
    bullets: [
      "Concierge intake call with thoughtful prompts",
      "Mentor circle recommendation plus welcome notes",
      "Calendar + micro-checklist that feels like a letter",
    ],
    peek: "Intake note + mentor preview card",
  },
  {
    title: "Phase 2 · Learn & Build",
    summary: "Academy, registry, and moodboard aligned with your style",
    description:
      "We guide you through nursery, gear, postpartum, and registry planning at a pace that feels cinematic, not frantic.",
    bullets: [
      "Binge-worthy academy modules with mentor feedback",
      "Dynamic registry tiles that show edits + thrifted pairings",
      "Moodboard + planner pulses that mirror your home",
    ],
    peek: "Modular academy card + registry tile",
  },
  {
    title: "Phase 3 · Connect & Grow",
    summary: "Mentor salons, community pulses, and evolving care",
    description:
      "Mentors, experts, and peers pop in with mini salons, voice notes, and check-ins so you always have a steady village.",
    bullets: [
      "Small mentor salons with real-time chat",
      "Guest experts + prompts that feel like a journal",
      "Community pulse polls with thoughtful reflections",
    ],
    peek: "Mentor chat + salon invite snippet",
  },
];

const monthlyExpectations = [
  {
    title: "Month 1 · The gentle intake",
    summary: "We learn your rituals, match the mentor energy, and send a luxe welcome kit.",
    points: [
      "Concierge intake call with voice note replies",
      "Mentor match preview + private chat link",
      "Registry moodboard + calm timeline",
    ],
  },
  {
    title: "Month 2 · The Binge-worthy academy",
    summary: "Modules land weekly. Every resource links back to your registry + mentor notes.",
    points: [
      "Car seat, nursery, and postpartum modules",
      "Mentor-styled registry edits drop beside each lesson",
      "Soft prompts that feel like a journal entry",
    ],
  },
  {
    title: "Month 3 · The mentor pulse",
    summary: "Community salons, pulse checks, and curated invites keep you feeling held.",
    points: [
      "Weekly salons + guest expert drops",
      "Community call recaps with honest insights",
      "Mentor notes that turn into future perk hints",
    ],
  },
];

export default function HowItWorksPage() {
  const [activePhase, setActivePhase] = useState(0);
  const [openMonth, setOpenMonth] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActivePhase(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    phaseRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const timelineProgress = phases.map((_, index) => index <= activePhase);

  return (
    <div className="space-y-16">
      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_80px_rgba(199,166,199,0.25)]">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Process</p>
          <h1 className="font-serif text-4xl text-[var(--tmbc-charcoal)]">
            This is how we take you from 'Where do I even start?' to 'I've got this.'
          </h1>
        </div>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          Every phase keeps your story slow and luminous. Learn · Plan · Connect with mentors who keep the vibe
          calm, witty, and real.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/request-invite"
            className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] shadow-[0_15px_45px_rgba(212,181,121,0.35)] transition hover:-translate-y-0.5"
          >
            Request Invite
          </Link>
          <Link
            href="/experience"
            className="rounded-[32px] border border-[var(--tmbc-charcoal)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]"
          >
            Experience Taylor-Made
          </Link>
        </div>
      </section>

      <section className="space-y-8 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/60 p-8 shadow-[0_20px_90px_rgba(199,166,199,0.25)]">
        <div className="space-y-3">
          <div className="rounded-full border border-[var(--tmbc-charcoal)]/10">
            <div className="flex h-2 overflow-hidden rounded-full">
              {timelineProgress.map((isActive, idx) => (
                <div
                  key={`segment-${idx}`}
                  className={`flex-1 transition duration-300 ${
                    isActive ? "bg-[var(--tmbc-mauve)]" : "bg-[var(--tmbc-blush)]/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60 md:grid-cols-3">
            {phases.map((phase) => (
              <span key={phase.title} className="text-center">
                {phase.title.split(' · ').pop()}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <article
              key={phase.title}
              ref={(node) => (phaseRefs.current[index] = node)}
              data-index={index}
              className={`group relative overflow-hidden rounded-[36px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-6 shadow-[0_15px_45px_rgba(199,166,199,0.15)] transition duration-300 ${
                activePhase === index ? "shadow-[0_25px_80px_rgba(199,166,199,0.35)]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/50">Phase {index + 1}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--tmbc-charcoal)]">{phase.title}</h3>
                </div>
                <span className="text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tmbc-mauve)]">
                  {phase.summary}
                </span>
              </div>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)]/70">{phase.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.75rem]">
                {phase.bullets.map((bullet) => (
                  <span
                    key={bullet}
                    className="rounded-full border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 px-3 py-1 text-[var(--tmbc-charcoal)]/70"
                  >
                    {bullet}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-2 rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/80 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/40">Peek</p>
                <p className="text-sm text-[var(--tmbc-charcoal)]/70">{phase.peek}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_90px_rgba(199,166,199,0.25)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Monthly cadence</p>
            <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">What to expect each month</h2>
          </div>
          <p className="text-sm text-[var(--tmbc-charcoal)]/70">Lean into the cadence, and we'll keep the village warm.</p>
        </div>
        <div className="space-y-3">
          {monthlyExpectations.map((month, index) => (
            <div
              key={month.title}
              className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-4 shadow-[0_12px_35px_rgba(199,166,199,0.15)]"
            >
              <button
                type="button"
                onClick={() => setOpenMonth((prev) => (prev === index ? null : index))}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                    {month.title}
                  </p>
                  <p className="text-sm text-[var(--tmbc-charcoal)]/70">{month.summary}</p>
                </div>
                <span className="text-xl text-[var(--tmbc-mauve)]">{openMonth === index ? "-" : "+"}</span>
              </button>
              <div
                className={`mt-3 overflow-hidden transition-all duration-300 ${
                  openMonth === index ? "max-h-60" : "max-h-0"
                }`}
              >
                <ul className="space-y-2 text-[0.85rem] text-[var(--tmbc-charcoal)]/70">
                  {month.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--tmbc-mauve)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-b from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/60 p-8 text-center shadow-[0_25px_90px_rgba(199,166,199,0.25)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Next step</p>
        <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Ready for the invite-only cadence?</h2>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          Every season is curated so you can stay intentional. Apply now and we'll tell you when the next mentor circle opens.
        </p>
        <div className="mx-auto mt-4 flex max-w-sm flex-wrap items-center justify-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
          <Link
            href="/request-invite"
            className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-6 py-3 text-[var(--tmbc-charcoal)] font-semibold"
          >
            Request Invite
          </Link>
          <Link
            href="/membership#faqs"
            className="rounded-[32px] border border-[var(--tmbc-charcoal)] px-6 py-3 text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]"
          >
            Membership FAQ
          </Link>
        </div>
      </section>
    </div>
  );
}

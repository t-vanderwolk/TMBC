"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const phases = [
  {
    title: "Tell us about your life",
    summary: "A short intake with real context",
    description:
      "We ask about your timing, your support, and what calm feels like. No trick questions.",
    bullets: [
      "Share your due date, home setup, and the pace you want.",
      "This is where a quiz would normally spit out a list. We don't do that.",
      "We read every note before matching you with a mentor.",
    ],
    peek: "Intake snapshot + mentor context note",
  },
  {
    title: "Meet your mentor",
    summary: "A real human, ready to guide",
    description:
      "You meet the mentor who will walk with you. It's a real intro, not a handoff.",
    bullets: [
      "A warm welcome and a clear first check-in.",
      "You can ask the messy questions here.",
      "Mentor notes that feel personal, not templated.",
    ],
    peek: "Mentor intro + first check-in",
  },
  {
    title: "Plan together",
    summary: "Shared decisions, paced on purpose",
    description:
      "You and your mentor map nursery, gear, and recovery in order, so nothing feels urgent.",
    bullets: [
      "Examples, not directives.",
      "No countdown timers. No panic buying.",
      "Decide what matters now vs later.",
    ],
    peek: "Shared plan + decision notes",
  },
  {
    title: "Decide when you're ready",
    summary: "You make the calls, at your pace",
    description:
      "When you're ready, you decide what stays, what waits, and what never needed to happen.",
    bullets: [
      "You stay in control of every decision.",
      "Room to change your mind.",
      "Mentor support if you want another pass.",
    ],
    peek: "Decision recap + next-step note",
  },
];

const monthlyExpectations = [
  {
    title: "Step 1 · The calm intake",
    summary: "We learn your rhythms and context so your mentor starts with the right picture.",
    points: [
      "A short intake you can finish in one sitting.",
      "No surprise quizzes or auto-generated lists.",
      "Notes are read by real humans, every time.",
    ],
  },
  {
    title: "Step 2 · The mentor hello",
    summary: "You meet your mentor and start with a clear, gentle first check-in.",
    points: [
      "A human intro, not a bot handoff.",
      "Clear next steps, no pressure to sprint.",
      "Ask the questions you've been holding.",
    ],
  },
  {
    title: "Step 3 · The shared plan",
    summary: "You and your mentor map what matters now and what can wait.",
    points: [
      "Plan together with context, not urgency.",
      "No countdown timers. No panic buying.",
      "Your pace leads, mentors follow.",
    ],
  },
  {
    title: "Step 4 · The final decisions",
    summary: "When you're ready, you decide. We're here if you want a second look.",
    points: [
      "You choose what stays and what goes.",
      "Room to change your mind anytime.",
      "Mentors support, they never push.",
    ],
  },
];

export default function HowItWorksPage() {
  const [activePhase, setActivePhase] = useState(0);
  const [openMonth, setOpenMonth] = useState<number | null>(0);
  const phaseRefs = useRef<HTMLDivElement[]>([]);

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
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Process</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            This is how we keep baby planning calm, human, and honest.
          </h1>
        </div>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          You share context, meet your mentor, plan together, and decide when you're ready. No list dumps. No
          pressure.
        </p>
        <div className="flex flex-col gap-3 text-[0.7rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request Invite
          </Link>
          <Link href="/membership" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
            Explore Membership
          </Link>
        </div>
      </section>

      <section className="space-y-8 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/60 p-8 shadow-[0_20px_90px_rgba(199,166,199,0.25)] marketing-section">
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
          <div className="grid gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60 md:grid-cols-4">
            {phases.map((phase) => (
              <span key={phase.title} className="text-center">
                {phase.title}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <article
              key={phase.title}
              ref={(node) => {
                if (!node || !(node instanceof HTMLDivElement)) return;
                phaseRefs.current[index] = node;
              }}
              data-index={index}
              className={`group relative overflow-hidden rounded-[36px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-6 shadow-[0_15px_45px_rgba(199,166,199,0.15)] transition duration-300 ${
                activePhase === index ? "shadow-[0_25px_80px_rgba(199,166,199,0.35)]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">Phase {index + 1}</p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-[var(--tmbc-charcoal)]">{phase.title}</h3>
                  </div>
                <span className="text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tmbc-mauve)]">
                  {phase.summary}
                </span>
              </div>
              <p className="mt-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{phase.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.75rem]">
                {phase.bullets.map((bullet) => (
                  <span
                    key={bullet}
                    className="rounded-full border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 px-3 py-1 text-[var(--tmbc-charcoal)] text-opacity-70"
                  >
                    {bullet}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-2 rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/80 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-40">Peek</p>
                <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">{phase.peek}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">What to expect</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">A steady, four-step rhythm</h2>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            A clear path that keeps decisions calm and paced.
          </p>
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
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                    {month.title}
                  </p>
                  <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">{month.summary}</p>
                </div>
                <span className="text-xl text-[var(--tmbc-mauve)]">{openMonth === index ? "-" : "+"}</span>
              </button>
                <div
                  className={`mt-3 overflow-hidden transition-all duration-300 ${
                    openMonth === index ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <ul className="space-y-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
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

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-b from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/60 p-8 text-center shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Next step</p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">Ready for the invite-only cadence?</h2>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          We keep invitations limited so mentors can offer real, attentive support. Apply now and we'll tell you when the next mentor circle opens.
        </p>
        <div className="mx-auto mt-4 flex w-full max-w-sm flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] sm:flex-row sm:justify-center sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request Invite
          </Link>
          <Link href="/membership#faqs" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
            Membership FAQ
          </Link>
        </div>
      </section>
    </div>
  );
}

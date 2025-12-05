import Link from "next/link";

import CTARibbon from "@/app/marketing/CTARibbon";
import Reveal from "@/components/marketing/Reveal";
import TestimonialsCarousel from "@/components/marketing/TestimonialsCarousel";

const pillars = [
  {
    title: "Learn",
    icon: "📖",
    description: "Academy modules that feel like afternoon reading, not homework.",
    bullets: [
      "Narrated lessons with instant mentor notes.",
      "Checkpoint prompts that ask how you're really doing.",
      "Soft homework you can pause, rewind, and finish on your own rhythm.",
    ],
  },
  {
    title: "Plan",
    icon: "🗂️",
    description: "Dynamic registry edits that mimic a curated wardrobe drop.",
    bullets: [
      "Registry cards that show mentor notes and reasoning.",
      "Pairs beautifully with your nursery mood board.",
      "Automations that keep chaos off your feed.",
    ],
  },
  {
    title: "Connect",
    icon: "✨",
    description: "Member-to-mentor community moments built for late-night 'is this normal?' chats.",
    bullets: [
      "Mentor circles and salons you can slide into anytime.",
      "Polls, reflections, and tiny celebrations that feel personal.",
      "Weekly calls, expert lunches, and gentle follow-ups.",
    ],
  },
];

const steps = [
  {
    title: "Request an invite",
    detail: "Tell us your due date, support needs, and the vibe you want for your village.",
    snippet: "Soft intake note + concierge scheduling.",
  },
  {
    title: "Get matched to a mentor",
    detail: "We pair you with a mentor circle or 1:1 guide that mirrors your rhythm.",
    snippet: "Mentor preview + warm welcome RSVP.",
  },
  {
    title: "Start the academy journey",
    detail: "We guide you through nursery, gear, and postpartum training in a calm, cinematic path.",
    snippet: "Module card snapshots with progress bars.",
  },
  {
    title: "Build your registry as you go",
    detail: "Registry lives beside your learning, so every click feels purposeful.",
    snippet: "Live registry tile + mentor notes.",
  },
];

const dashboardHighlights = [
  {
    title: "Academy",
    caption: "Car Seat Masterclass · 40% complete",
    note: 'Mentor voice note: “You already get the softness, now nail the base.”',
  },
  {
    title: "Registry",
    caption: "Curated essentials · 12 items",
    note: 'Mentor: “Skip the wipe warmer unless you love the glow.”',
  },
  {
    title: "Mentor chat",
    caption: "Upcoming salons · 2",
    note: 'Mentor: “Journal prompt: what’s the one thing you want to keep from this trimester?”',
  },
];

export const metadata = {
  title: "Taylor-Made Baby Co. - Concierge birth & baby planning",
};

export default function HomePage() {
  return (
    <div className="space-y-20 text-[var(--tmbc-charcoal)]">
      <section className="relative grid gap-10 rounded-[56px] border border-[var(--tmbc-gold)] bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.35)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Reveal>
            <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">
              Invite-only concierge
            </p>
          </Reveal>
          <Reveal>
            <h1 className="font-serif text-4xl leading-tight text-[var(--tmbc-charcoal)] sm:text-5xl">
              Baby prep, Taylor-Made.
            </h1>
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-lg text-[var(--tmbc-charcoal)]/80">
              An invite-only concierge community where you learn, build your registry, and get real support from
              people who&apos;ve been there before you even ask.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-sm text-[var(--tmbc-charcoal)]/70">
              Warm · Witty · Wise · Real — just like your mentor circle.
            </p>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/request-invite"
                className="rounded-[32px] border border-transparent bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] shadow-[0_15px_45px_rgba(212,181,121,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_70px_rgba(212,181,121,0.45)]"
              >
                Request Invite
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-[32px] border border-[var(--tmbc-charcoal)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--tmbc-mauve)]"
              >
                Already invited? Log in
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/50">
              Member-to-mentor community with receipts.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="group relative overflow-hidden rounded-[48px] border border-[var(--tmbc-mauve)] bg-gradient-to-b from-white via-[var(--tmbc-ivory)] to-[var(--tmbc-blush)] p-6 shadow-[0_20px_80px_rgba(199,166,199,0.35)]">
            <div className="pointer-events-none absolute inset-0 rounded-[48px] bg-[radial-gradient(circle_at_top,_rgba(212,181,121,0.15),_transparent_55%)] opacity-80" />
            <div className="pointer-events-none absolute -top-6 left-6 flex gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-gold)]">
              <span className="animate-[pulse_5s_ease-in-out_infinite]">✨</span>
              <span className="animate-[pulse_5s_ease-in-out_infinite] delay-200">✨</span>
            </div>
            <div className="relative flex flex-col gap-4">
              <div className="space-y-3 rounded-[32px] bg-white/80 p-4 shadow-[0_20px_60px_rgba(199,166,199,0.25)] transition duration-300 group-hover:-translate-y-1">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/50">Academy</p>
                <h3 className="font-semibold text-lg text-[var(--tmbc-charcoal)]">Car Seat Masterclass</h3>
                <div className="h-1.5 rounded-full bg-[var(--tmbc-blush)]">
                  <div className="h-full w-2/5 rounded-full bg-[var(--tmbc-mauve)]" />
                </div>
                <p className="text-xs text-[var(--tmbc-charcoal)]/60">Mentor circle: Ellie + Marisol</p>
              </div>
              <div className="grid gap-3 rounded-[32px] bg-[var(--tmbc-ivory)] p-4 shadow-[0_18px_40px_rgba(199,166,199,0.22)]">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">
                  <span>Registry</span>
                  <span>Quiet edit</span>
                </div>
                <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">
                  Modern crib · mixed sorter · 1 note
                </p>
                <p className="text-[0.7rem] text-[var(--tmbc-charcoal)]/60">
                  Mentor: “Skip the wipe warmer unless you love glow.”
                </p>
              </div>
              <div className="rounded-[32px] bg-white/90 p-4 text-sm text-[var(--tmbc-charcoal)] shadow-[0_15px_45px_rgba(199,166,199,0.25)]">
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/50">
                  Mentor chat
                </p>
                <p className="mt-1 text-base font-semibold">Upcoming salons</p>
                <p className="text-xs text-[var(--tmbc-charcoal)]/70">
                  Mindful third trimester Q&amp;A · Friday · 6p PST
                </p>
              </div>
            </div>

            <div className="absolute inset-0 -z-10 rounded-[48px] bg-gradient-to-br from-[var(--tmbc-mauve)]/30 via-[var(--tmbc-blush)]/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -bottom-6 right-8 flex gap-1 text-[0.75rem] text-[var(--tmbc-gold)] opacity-70 transition duration-500 group-hover:translate-y-1">
              <span>confetti ✶</span>
              <span>confetti ✶</span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="space-y-8 rounded-[48px] border border-[var(--tmbc-mauve)]/40 bg-white/70 p-8 shadow-[0_25px_70px_rgba(199,166,199,0.25)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Pillars</p>
            <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Learn · Plan · Connect</h2>
          </div>
          <p className="text-sm text-[var(--tmbc-charcoal)]/70">
            A concierge rhythm that feels cinematic, not chaotic.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative overflow-hidden rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_18px_60px_rgba(199,166,199,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(199,166,199,0.3)]"
            >
              <div className="text-2xl">{pillar.icon}</div>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--tmbc-charcoal)]">{pillar.title}</h3>
              <p className="mt-2 text-sm text-[var(--tmbc-charcoal)]/70">{pillar.description}</p>
              <div className="mt-4 max-h-0 overflow-hidden text-[0.7rem] text-[var(--tmbc-charcoal)]/60 transition-all duration-500 group-hover:max-h-40">
                <ul className="space-y-1">
                  {pillar.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--tmbc-mauve)]" />
                      <span className="text-xs uppercase tracking-[0.35em]">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_20px_90px_rgba(199,166,199,0.25)]">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Timeline</p>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">How it works in 4 steps</h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[var(--tmbc-gold)]/40 to-[var(--tmbc-mauve)]/40 md:hidden" />
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6 text-sm text-[var(--tmbc-charcoal)] shadow-[0_15px_45px_rgba(199,166,199,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(199,166,199,0.3)]"
              >
                <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-[0.85rem] text-[var(--tmbc-charcoal)]/70">{step.detail}</p>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--tmbc-blush)]/70 bg-[var(--tmbc-ivory)]/80 px-4 py-2 text-[0.75rem] font-semibold text-[var(--tmbc-mauve)] transition duration-300 group-hover:border-[var(--tmbc-gold)] group-hover:bg-[var(--tmbc-mauve)]/10">
                  <p>{step.snippet}</p>
                  <span className="text-xs text-[var(--tmbc-charcoal)]/60">›</span>
                </div>
                <div className="absolute -right-6 top-6 hidden h-24 w-24 -translate-x-1/2 rounded-full bg-gradient-to-br from-[var(--tmbc-gold)]/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-80 md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Inside the dashboard</p>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Inside your Taylor-Made dashboard</h2>
          <p className="text-sm text-[var(--tmbc-charcoal)]/70">
            Academy, registry, and mentor notes live together in one calm, curated screen.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {dashboardHighlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-white to-[var(--tmbc-blush)]/60 p-5 text-[var(--tmbc-charcoal)] shadow-[0_15px_45px_rgba(199,166,199,0.2)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/50">
                {highlight.title}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--tmbc-charcoal)]">
                {highlight.caption}
              </h3>
              <p className="mt-2 text-sm text-[var(--tmbc-charcoal)]/70">{highlight.note}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 text-sm text-[var(--tmbc-charcoal)] md:grid-cols-3">
          <p className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-4">
            See learning, registry, and events in one calm view.
          </p>
          <p className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-4">
            Mentors see what you see and leave notes directly.
          </p>
          <p className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-4">
            Every click quietly tracks what you love for future perks.
          </p>
        </div>
      </section>

      <section>
        <TestimonialsCarousel />
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 p-10 text-center shadow-[0_25px_90px_rgba(199,166,199,0.25)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Final invite</p>
        <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">
          Let&apos;s build your baby village before the baby arrives.
        </h2>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          TMBC is currently invite-only, with limited beta spots open each month.
        </p>
        <div className="flex flex-col gap-3 rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-6 shadow-[0_20px_80px_rgba(199,166,199,0.25)] sm:flex-row sm:items-center sm:justify-center">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 rounded-full border border-[var(--tmbc-blush)]/70 bg-[var(--tmbc-ivory)] px-5 py-3 text-sm text-[var(--tmbc-charcoal)] focus:border-[var(--tmbc-mauve)] focus:outline-none"
          />
          <Link
            href="/request-invite"
            className="rounded-full bg-[var(--tmbc-mauve)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] transition hover:translate-y-0.5 hover:bg-gradient-to-r hover:from-[var(--tmbc-gold)] hover:to-[var(--tmbc-blush)]"
          >
            Request Invite
          </Link>
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
          Takes 2 minutes · No spam · We&apos;ll tell you if we&apos;re not the right fit. Invite-only and curated.
        </p>
      </section>

      <CTARibbon
        headline="Ready for something gently extraordinary?"
        supportingText="Invitation spaces are curated each season to keep the experience quiet, intentional, and luminous."
        buttonLabel="Share Your Intentions"
        buttonHref="/request-invite"
      />
    </div>
  );
}

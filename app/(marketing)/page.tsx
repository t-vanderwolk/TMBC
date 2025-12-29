"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CTARibbon from "@/components/marketing/CTARibbon";
import Reveal from "@/components/marketing/Reveal";
import TestimonialsCarousel from "@/components/marketing/TestimonialsCarousel";
import VisualPlaceholder from "@/components/marketing/VisualPlaceholder";
import { api } from "@/lib/api";
import { PUBLIC_LOGIN_ROUTE } from "@/lib/auth/routeForRole";

const pillars = [
  {
    title: "A calm, concierge-led journey",
    description: "Personalized planning guided by real humans — thoughtfully paced, never rushed.",
  },
  {
    title: "A living plan that evolves with you",
    description: "Not static checklists. A roadmap that adapts as your family and priorities change.",
  },
  {
    title: "Community that feels intimate",
    description: "Moderated conversations, meaningful gatherings, and connections that actually last.",
  },
  {
    title: "A Member-for-Life promise",
    description: "Return for new chapters — siblings, refreshes, transitions — without starting over.",
  },
  {
    title: "A Mentor-to-Member pathway",
    description: "Lived experience becomes shared wisdom, supporting the families who come next.",
  },
];

const steps = [
  {
    title: "Tell us about your life",
    detail: "A short intake about your home, support, and what calm looks like. No trick questions.",
    snippet: "Context, not a quiz.",
  },
  {
    title: "Meet your mentor",
    detail: "We match you with a real human who listens, follows up, and stays in your corner.",
    snippet: "A real intro, not a handoff.",
  },
  {
    title: "Plan together",
    detail: "You and your mentor map nursery, gear, and recovery at a pace that fits your life.",
    snippet: "Shared plan, not a list dump.",
  },
  {
    title: "Decide when you're ready",
    detail: "You make the call on what stays, what waits, and what never needed to happen.",
    snippet: "No countdown timers. No panic buying.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInviteSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmed = inviteCode.trim();
    if (!trimmed) {
      setError("Please enter your invite code.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await api.post("/onboarding/validate", { code: trimmed });
      router.push(`/onboarding?code=${encodeURIComponent(trimmed)}`);
    } catch (err) {
      setError("Invalid or already used invite code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 text-[var(--tmbc-charcoal)]">
      <section className="relative grid grid-cols-1 gap-10 rounded-[56px] border border-[var(--tmbc-gold)] bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.35)] marketing-section md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Reveal>
            <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Invite-only mentor-led planning
            </p>
          </Reveal>
          <Reveal>
            <h1 className="font-serif text-4xl leading-tight text-[var(--tmbc-charcoal)] sm:text-5xl">
              Baby planning, guided by someone who's actually done this before.
            </h1>
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-lg text-[var(--tmbc-charcoal)] text-opacity-80">
              Taylor-Made Baby Co. is an invite-only, mentor-led baby planning experience. No auto-picks. No overwhelm.
              Just thoughtful guidance from a real human.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Mentor-led planning for registry decisions that fit your real life.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Warm · Witty · Wise · Real - just like your mentor circle.
            </p>
          </Reveal>
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em] shadow-[0_15px_45px_rgba(212,181,121,0.35)]"
              >
                Request Invite
              </Link>
              <Link
                href="/experience"
                className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
              >
                The Experience
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-3 rounded-[32px] border border-[var(--tmbc-blush)] bg-gradient-to-br from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/40 p-5 shadow-[0_20px_70px_rgba(212,181,121,0.25)]">
              <p className="text-[0.6rem] uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Invite code ready?
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]">
                Enter and begin onboarding
              </p>
              <form onSubmit={handleInviteSubmit} className="marketing-form mt-6">
                <label>
                  <span>Invite code</span>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(event) => setInviteCode(event.target.value)}
                    placeholder="Enter invite code"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!inviteCode.trim() || submitting}
                  className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
                >
                  {submitting ? "Submitting..." : "Begin onboarding"}
                </button>
              </form>
              <Link
                href={PUBLIC_LOGIN_ROUTE}
                className="inline-flex items-center text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-70"
              >
                Already invited? Log in
              </Link>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-50">
              Member-to-mentor community with real humans.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <VisualPlaceholder
            label="Hero lifestyle image or calm planning moment"
            className="h-full"
            minHeightClassName="min-h-[420px]"
          />
        </Reveal>
      </section>

      <section className="space-y-8 rounded-[48px] border border-[var(--tmbc-mauve)]/40 bg-white/70 p-8 pb-10 shadow-[0_25px_70px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Pillars</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A different way to prepare — steady, thoughtful, and human.
          </h2>
        </div>
        {/* TODO: Expand this pillar section with testimonials or visuals later. */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_18px_60px_rgba(199,166,199,0.15)]"
            >
              <h3 className="text-xl sm:text-2xl font-semibold font-serif text-[var(--tmbc-charcoal)]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{pillar.description}</p>
            </div>
          ))}
        </div>
        <div className="h-px w-full bg-[var(--tmbc-mauve)]/20" />
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_20px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Timeline</p>
          <h2 className="font-serif text-2xl text-[var(--tmbc-charcoal)] sm:text-3xl">How it works in 4 steps</h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[var(--tmbc-gold)]/40 to-[var(--tmbc-mauve)]/40 md:hidden" />
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6 text-sm text-[var(--tmbc-charcoal)] shadow-[0_15px_45px_rgba(199,166,199,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(199,166,199,0.3)]"
              >
                <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{step.title}</h3>
                <p className="mt-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{step.detail}</p>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--tmbc-blush)]/70 bg-[var(--tmbc-ivory)]/80 px-4 py-2 text-[0.75rem] font-semibold text-[var(--tmbc-mauve)] transition duration-300 group-hover:border-[var(--tmbc-gold)] group-hover:bg-[var(--tmbc-mauve)]/10">
                  <p>{step.snippet}</p>
                  <span className="text-xs text-[var(--tmbc-charcoal)] text-opacity-60">›</span>
                </div>
                <div className="absolute -right-6 top-6 hidden h-24 w-24 -translate-x-1/2 rounded-full bg-gradient-to-br from-[var(--tmbc-gold)]/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-80 md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Inside the dashboard</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">Inside your Taylor-Made dashboard</h2>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            Your plan, mentor notes, and check-ins live together in one calm view.
          </p>
        </div>
        <div className="flex items-center justify-center rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-white to-[var(--tmbc-blush)]/60 p-6 shadow-[0_15px_45px_rgba(199,166,199,0.2)]">
          <Image
            src="/images/marketing/ecosystem-preview.png"
            alt="Member dashboard mobile preview"
            width={640}
            height={1200}
            className="h-auto max-h-[520px] w-auto"
            priority
          />
        </div>
        <div className="grid gap-4 text-base text-[var(--tmbc-charcoal)] md:grid-cols-3">
          <p className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-4">
            See your plan, notes, and next steps in one calm view.
          </p>
          <p className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-4">
            Mentors see what you see and leave notes directly.
          </p>
          <p className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-4">
            Nothing is auto-filled. Every decision stays in your hands.
          </p>
        </div>
      </section>

      <section className="marketing-section">
        <TestimonialsCarousel />
      </section>


      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 p-10 text-center shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Final invite</p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
          Let&apos;s build your baby village before the baby arrives.
        </h2>
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          We keep TMBC invite-only so every member gets real, attentive support from a mentor.
        </p>
        <div className="marketing-form mx-auto w-full max-w-xl rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-6 shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
          <label>
            <span>Email address</span>
            <input
              type="email"
              placeholder="hello@taylormadebaby.co"
            />
          </label>
          <Link
            href="/request-invite"
            className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
          >
            Request Invite
          </Link>
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Takes 2 minutes · No spam · We&apos;ll tell you if we&apos;re not the right fit.
        </p>
      </section>

      <CTARibbon
        headline="Ready for a calmer way to prepare?"
        supportingText="We keep invitations limited so mentors can offer real, attentive support."
        buttonLabel="Request an Invite"
        buttonHref="/request-invite"
      />
    </div>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import InviteSection from "@/components/marketing/InviteSection";

const noiseNotes = [
  "Every checklist is shouting for attention, making the next decision feel urgent even when you just need a breather.",
  "Social feeds and product hype make preparation feel performative, leaving you second-guessing your own instincts.",
  "It is hard to hear your own questions when every screen demands a ‘complete’ button."
];

const quietResponse = [
  "We slowed down the rhythm so your mentor-led circle can surface context before you ever pick a task.",
  "Intentional pacing keeps the care calm — no countdowns, no pressure, just thoughtful presence.",
  "We keep the experience human, private, and leaning toward long-term support rather than short-term urgency."
];

const differenceHighlights = [
  "Mentors, not algorithms.",
  "Pacing, not rushing.",
  "Care, not checklists."
];

const rhythms = [
  "Learn — give yourself new clarity without frantic consumption.",
  "Plan — make quiet choices with a mentor instead of Googling at 2am.",
  "Connect — settle into moderated rooms that honor your privacy.",
  "Reflect — keep keepsakes that feel like letters, not feeds."
];

const inviteEchos = [
  "Invite-only keeps mentor ratios healthy so care stays personal.",
  "We welcome members slowly so every conversation remains attentive.",
  "This is not about scarcity; it is about protecting the calm."
];

const fitStatements = [
  {
    title: "You want permission to pause",
    description:
      "You prefer thoughtful nudges to loud notifications and value mentors who listen before they advise.",
  },
  {
    title: "You choose your own pace",
    description:
      "Every decision or question arrives on your schedule, and TMBC adapts with you.",
  },
  {
    title: "You honor quiet support",
    description:
      "You’re ready for guidance that feels steady and rare, not hype and urgent."
    },
];

export default function HomePage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. marketing hero"
        imageWidth={1536}
        imageHeight={1024}
        headline="You’re not behind. You’re just surrounded by noise."
        supportingText="We offer calm, mentor-led preparation — emotional orientation before features, care before urgency."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How it works (gently)",
          href: "/how-it-works",
        }}
        priority
      />
      <RibbonDivider />
      <MarketingContent>
        <Suspense fallback={<div className="min-h-[20vh]" />}>
          <InviteSection />
        </Suspense>
        <div className="marketing-content space-y-20 md:space-y-24 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Why it feels loud
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                The noise is louder than the questions.
              </h2>
            </div>
            <div className="mt-8 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {noiseNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                So we built something quieter
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Orientation before explanation.
              </h2>
            </div>
            <div className="mt-8 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {quietResponse.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What makes this different
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Values, not features.
              </h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {differenceHighlights.map((highlight) => (
                <div key={highlight} className="marketing-card bg-white/80 p-6">
                  <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{highlight}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The four rhythms
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Learn, plan, connect, reflect.
              </h2>
            </div>
            <div className="mt-8 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {rhythms.map((rhythm) => (
                <p key={rhythm}>{rhythm}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Invite-only, reframed
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Careful intake keeps the care personal.
              </h2>
            </div>
            <div className="mt-8 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {inviteEchos.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Who this is for / not for
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Permission to opt in or out.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {fitStatements.map((fit) => (
                <div key={fit.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {fit.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{fit.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Closing confidence
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                We hold care, not urgency.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                When you’re ready, request an invite and keep leaning into the calm support we keep showing up with.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/request-invite"
                  className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
                >
                  Request an Invite
                </Link>
                <Link
                  href="/how-it-works"
                  className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
                >
                  How it works (gently)
                </Link>
              </div>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}

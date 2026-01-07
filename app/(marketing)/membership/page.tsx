import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import RibbonDivider from "@/components/marketing/RibbonDivider";

const membershipHighlights = [
  {
    title: "Belonging",
    description:
      "Mentor-led rhythms keep you steady, so the preparation feels like a circle of support rather than a race.",
  },
  {
    title: "Rhythm",
    description:
      "Academy moments, planning check-ins, and small circles rotate through a calm cadence you can revisit when needed.",
  },
  {
    title: "Continuity",
    description:
      "We build space to continue learning, connecting, and reflecting — even after a milestone passes.",
  },
];

const supportSignals = [
  {
    title: "Personal mentor",
    description:
      "A real human meets you where you are, keeps the conversation grounded, and remembers the details that matter.",
  },
  {
    title: "Guided learning",
    description:
      "Modules surface clarity, not overwhelm, so planning feels like a conversation about your next calm step.",
  },
  {
    title: "Shared circles",
    description:
      "Small group connections, curated events, and thoughtful follow-ups keep the village gentle instead of noisy.",
  },
  {
    title: "Private reflection",
    description:
      "We leave room to reflect quietly, write what feels true, and return whenever the story needs reshaping.",
  },
];

const progression = [
  {
    stage: "Member",
    description: "You begin with learning, planning quietly, and leaning into mentors who listen.",
  },
  {
    stage: "Experienced Member",
    description: "Confidence grows, reflections deepen, and you share insight when it feels right.",
  },
  {
    stage: "Mentor",
    description: "When you’re ready, you guide others — still within the same calm, intentional circle.",
  },
];

const inviteReasons = [
  "Keeps mentor ratios healthy so each member feels seen.",
  "Preserves the pacing and tone the village relies on.",
  "Ensures every request is reviewed with care.",
];

export default function MembershipPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Soft ribbon hero art for membership."
        imageWidth={1536}
        imageHeight={1024}
        headline="Membership is a calm circle, not a checklist."
        supportingText="It exists for people who want thoughtful mentor care, ongoing learning, and the chance to keep guiding others when they are ready."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-soft uppercase tracking-[0.35em]",
        }}
        priority
      />
      <RibbonDivider />
      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="text-center space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What membership gives you
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl">
                Belonging, rhythm, and continuous care.
              </h2>
              <p className="max-w-3xl mx-auto text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Membership keeps you rooted in learning, planning at your pace, and connecting without comparison.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {membershipHighlights.map((highlight) => (
                <div key={highlight.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {highlight.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Mentor-guided support
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl">
                The care shows up intentionally.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {supportSignals.map((signal) => (
                <div key={signal.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {signal.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Member → Mentor journey
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl">
                Growth happens at your pace.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {progression.map((step) => (
                <div
                  key={step.stage}
                  className="marketing-card bg-white/80 p-6 text-center"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {step.stage}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Invite-only care
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl">
                We keep the village small for the support to stay personal.
              </h2>
              <div className="space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                {inviteReasons.map((reason) => (
                  <p key={reason}>• {reason}</p>
                ))}
              </div>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-soft uppercase tracking-[0.35em]"
              >
                Request an Invite
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}

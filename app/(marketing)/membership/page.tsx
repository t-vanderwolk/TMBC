import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

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
      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="text-center space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What membership gives you
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Belonging, rhythm, and continuous care.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
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

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-24 mb-8">
            <div className="text-center space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Mentor-guided access
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                The care shows up intentionally.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                You get a personal mentor, guided learning, shared circles, and space for reflection without noise.
              </p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {supportSignals.map((signal) => (
                <div key={signal.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {signal.title}
                  </p>
                  <p className="mt-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-3 text-left text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Member → Mentor path
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {progression.map((step) => (
                  <p key={step.stage}>• {step.stage}: {step.description}</p>
                ))}
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="space-y-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Membership glimpses
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                The dashboard and progression keep the circle visible
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                See how the dashboard orients you in ongoing care and how the member-to-mentor path keeps that care steady.
              </p>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-3 text-center">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  Dashboard overview
                </p>
                <p className="max-w-[320px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  A calm, editorial dashboard keeps your learning, planning, and circles in one quiet view.
                </p>
                <div className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/dashboardpreview.png"
                    alt="Membership dashboard preview showing learning, planning, and circle highlights"
                    width={360}
                    height={720}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  Member → Mentor progression
                </p>
                <p className="max-w-[320px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  The progression view shows how your mentor keeps decisions, reflections, and invitations aligned.
                </p>
                <div className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/membertomentor.png"
                    alt="Member to mentor progression preview showing decision notes and gentle prompts"
                    width={360}
                    height={720}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Invite-only care
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
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

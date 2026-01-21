import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

const membershipHighlights = [
  {
    title: "Belonging",
    description: "Mentor-led rhythms keep you steady so preparation feels like a circle, not a sprint.",
  },
  {
    title: "Rhythm",
    description: "Academy moments, planning check-ins, and small circles rotate through a calm cadence.",
  },
  {
    title: "Continuity",
    description: "We leave room to keep learning, connecting, and reflecting even after milestones pass.",
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
    description: "When you’re ready, you guide others — still within the same calm circle.",
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
        imageSrc="/images/marketing/home-hero.png"
        imageAlt="Soft ribbon hero art for membership."
        imageWidth={1536}
        imageHeight={1024}
        headline="Membership is a calm circle, not a checklist."
        subheading="It exists for people who want thoughtful mentor care and ongoing quiet learning."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        priority
        motion
      />
      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="text-center space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What membership gives you
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Belonging, rhythm, continuous care.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70 mx-auto">
                Membership keeps you rooted in learning, planning at your pace, and connecting without comparison.
              </p>
            </div>
            <div className="mt-10 space-y-4 md:hidden">
              {membershipHighlights.map((highlight) => (
                <details
                  key={highlight.title}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {highlight.title}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{highlight.description}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 hidden gap-6 md:grid md:grid-cols-3">
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

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-24 mb-8 border-y border-[var(--tmbc-charcoal)]/10">
            <div className="text-center space-y-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Mentor-guided access
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                The care shows up intentionally.
              </h2>
              <p className="max-w-3xl mx-auto text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                You get a personal mentor, guided learning, shared circles, and space for reflection without noise.
              </p>
            </div>
            <div className="mt-8 space-y-4 md:hidden">
              {supportSignals.map((signal) => (
                <details
                  key={signal.title}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/70 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {signal.title}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{signal.description}</p>
                </details>
              ))}
            </div>
            <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2">
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
            <div className="mt-10 text-left text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Member → Mentor path
              </p>
              <ul className="mkt-bullet-list">
                {progression.map((step) => (
                  <li key={step.stage} className="mkt-bullet-item">
                    <span className="font-semibold text-[var(--tmbc-charcoal)]">{step.stage}</span>:{" "}
                    {step.description}
                  </li>
                ))}
              </ul>
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
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70 mx-auto">
                See how the dashboard orients you in ongoing care and how the member-to-mentor path keeps that care steady.
              </p>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-3 text-center">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  Dashboard overview
                </p>
                <p className="max-w-[320px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  A calm, editorial dashboard keeps learning, planning, and circles in one quiet view.
                </p>
                <ImageFrame className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/dashboardpreview.png"
                    alt="Membership dashboard preview showing learning, planning, and circle highlights"
                    width={360}
                    height={720}
                  />
                </ImageFrame>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  Member → Mentor progression
                </p>
                <p className="max-w-[320px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  The progression view shows how your mentor keeps decisions, reflections, and invitations aligned.
                </p>
                <ImageFrame className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/membertomentor.png"
                    alt="Member to mentor progression preview showing decision notes and gentle prompts"
                    width={360}
                    height={720}
                  />
                </ImageFrame>
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Invite-only care
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                We keep the village small so support stays personal.
              </h2>
              <ul className="mkt-bullet-list">
                {inviteReasons.map((reason) => (
                  <li key={reason} className="mkt-bullet-item">
                    {reason}
                  </li>
                ))}
              </ul>
              <Link href="/request-invite" className="mkt-btn-primary">
                Request an Invite
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}

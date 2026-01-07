import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import RibbonDivider from "@/components/marketing/RibbonDivider";
const membershipPillars = [
  {
    title: "Learn",
    items: [
      "Academy journeys (Nursery, Gear, Postpartum)",
      "Guided reflections and workbooks",
      "Community learning spaces",
    ],
  },
  {
    title: "Plan",
    items: [
      "Registry activation and organization",
      "Mentor-guided decisions",
      "Ongoing updates (not one-time lists)",
    ],
  },
  {
    title: "Connect",
    items: [
      "Direct mentor messaging",
      "Circles & events",
      "Shared learning — not forums",
    ],
  },
];

const pathwaySteps = [
  {
    title: "Member",
    items: [
      "Learns through the Academy",
      "Plans registry with guidance",
      "Participates in community",
    ],
  },
  {
    title: "Experienced Member",
    items: [
      "Shares reflections",
      "Supports discussions",
      "Builds confidence",
    ],
  },
  {
    title: "Mentor (Invite + Certification)",
    items: [
      "Completes Taylor-Made Baby Academy certification",
      "Supports new members",
      "Hosts events and curates guidance",
    ],
  },
];

const mentorCapabilities = [
  "One-on-one guidance",
  "Group circles",
  "Educational content",
  "Registry support",
];

const platformSupport = [
  "Tools and templates",
  "Admin moderation",
  "Editorial review",
  "Compliance handling",
];

const inviteReasons = [
  "Keeps mentor ratios healthy",
  "Preserves quality conversations",
  "Allows intentional growth",
];

export default function MembershipPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Founding Circle hero artwork for membership."
        imageWidth={1536}
        imageHeight={1024}
        headline="Start as a member. Grow into a mentor."
        supportingText="Membership gives you guided baby prep, personal support, and a clear path to becoming the calm voice for someone else — when you’re ready. (No pressure. No rush.)"
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-soft uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How mentorship works",
          href: "/how-it-works",
        }}
        priority
      />
      <RibbonDivider />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
        <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Membership
          </p>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Editorial-first guidance · Invite-only access · Transparent partner disclosures
          </p>
        </div>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-[var(--tmbc-ivory)]/40 px-8 py-20 md:py-32">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What membership means
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Membership is your foundation — not your finish line.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {membershipPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {pillar.title}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                {pillar.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-[680px] text-center text-sm uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-70">
          Membership gives you access. Mentorship gives you impact. (Only if you want it.)
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-[var(--tmbc-ivory)]/40 px-8 py-20 md:py-32">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Member → Mentor pathway
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            From Member to Mentor — by design, not pressure.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pathwaySteps.map((step, index) => (
            <div
              key={step.title}
              className="marketing-card bg-white/80 p-6"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                Step {index + 1}
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--tmbc-charcoal)]">{step.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                {step.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-[680px] text-center text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          Mentorship is optional, earned, and supported — never required. (Some members stay right where they are.)
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What mentors unlock
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Mentorship is about contribution — with recognition built in.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
              Mentor capabilities
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              {mentorCapabilities.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
              Platform support
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              {platformSupport.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          Mentors never ‘sell’ — recommendations are contextual, optional, and fully disclosed. (Always.)
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-5 bg-white/80 px-8 py-20 md:py-32">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Why this model exists
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            We built the platform we wish existed.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="max-w-[680px] space-y-6 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            <p>
              Hourly consults can feel transactional. Courses can feel isolating. Affiliate-driven content can struggle
              to earn trust. We wanted a slower, more human system that keeps guidance calm, clear, and accountable.
            </p>
            <p>Think of it as a steady hand — not another list.</p>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-card space-y-5 bg-white/80 px-8 py-20 md:py-32">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Invite-only clarification
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Membership is invite-only to protect the experience.
          </h2>
        </div>
        <ul className="space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          {inviteReasons.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/request-invite"
            className="marketing-btn marketing-btn-primary marketing-btn-primary-soft uppercase tracking-[0.35em]"
          >
            Request an Invite
          </Link>
          <span className="text-[var(--tmbc-charcoal)] text-opacity-60 text-xs normal-case">
            Requests are reviewed weekly. (We read every one.)
          </span>
        </div>
      </section>
        </div>
      </MarketingContent>
    </>
  );
}

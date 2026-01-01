import Link from "next/link";
import Image from "next/image";

import promiseVisual from "../../../assets/images/diagram-membership-promise.png";
import membershipEditorial from "../../../assets/images/editorial-about-family-bump.jpeg";
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
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Membership
        </p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
          Membership that can grow into mentorship, if and when it feels right
        </h1>
        <p className="mt-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Learn with support. Plan with clarity. Stay connected as your questions evolve. (No rush, ever.)
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Editorial-first guidance · Invite-only access · Transparent partner disclosures
        </p>
        <div className="mt-6 flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request an Invite
          </Link>
          <Link href="/how-it-works" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
            How mentorship works
          </Link>
        </div>
      </section>

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="relative w-full overflow-hidden rounded-[36px] border border-[var(--tmbc-mauve)]/20 bg-white/80 aspect-[4/3]">
          <Image
            src={promiseVisual}
            alt="The registry process doesn't have to be overwhelming"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
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
              className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
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
        <p className="text-center text-sm uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-70">
          Membership gives you access. Mentorship gives you impact. (Only if you want it.)
        </p>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
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
              className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
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
        <p className="text-center text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          Mentorship is optional, earned, and supported — never required. (Some members stay right where they are.)
        </p>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What mentors unlock
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Mentorship is about contribution — with recognition built in.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
              Mentor capabilities
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              {mentorCapabilities.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6">
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
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          Mentors never ‘sell’ — recommendations are contextual, optional, and fully disclosed. (Always.)
        </p>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-white to-[var(--tmbc-blush)]/50 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Why this model exists
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            We built the platform we wish existed.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            <p>
              Hourly consults can feel transactional. Courses can feel isolating. Affiliate-driven content can struggle
              to earn trust. We wanted a slower, more human system that keeps guidance calm, clear, and accountable.
            </p>
            <p>Think of it as a steady hand — not another list.</p>
          </div>
          <div className="relative w-full overflow-hidden rounded-[32px] border border-[var(--tmbc-mauve)]/20 bg-white/80 aspect-[4/5]">
            <Image
              src={membershipEditorial}
              alt="Parent resting with a growing bump"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Invite-only clarification
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Membership is invite-only to protect the experience.
          </h2>
        </div>
        <ul className="space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          {inviteReasons.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:items-center sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request an Invite
          </Link>
          <span className="text-[var(--tmbc-charcoal)] text-opacity-60 text-xs normal-case">
            Requests are reviewed weekly. (We read every one.)
          </span>
        </div>
      </section>
    </div>
  );
}

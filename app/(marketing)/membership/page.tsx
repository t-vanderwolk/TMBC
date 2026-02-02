import Button from "@/components/ui/Button";
import MarketingHero from "@/components/marketing/MarketingHero";
import { MarketingHeading } from "@/components/marketing/Typography";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import membershipHero from "@/assets/images/membershiphero.png";
import { SectionBand, textCage, cardBase, dividerRhythm } from "@/components/marketing/MarketingCadence";
/**
 * TMBC Transition Rules:
 * - Blush sections may end with a gradient fade into ivory via .section-transition.
 * - Apply the transition only on the final blush block before an ivory section.
 * - Never use transitions under the hero or between ivory bands.
 * - Do not stack multiple transitions back-to-back.
 */

const includeCards = [
  {
    title: "Personal mentor support",
    copy: "A steady companion who listens, remembers, and keeps your planning calm.",
  },
  {
    title: "Bespoke baby planning",
    copy: "Custom rhythms, check-ins, and gentle nudges that honor your pace.",
  },
  {
    title: "Calm registry guidance",
    copy: "Softly curated recommendations so you can build a thoughtful list without the noise.",
  },
  {
    title: "Ongoing reflection & support",
    copy: "Quarterly reviews, reflective prompts, and space to return as your story evolves.",
  },
];

const pricingNotes = [
  "Simple, transparent membership with no hidden layers.",
  "No upsells or product pushing—your mentor focuses on you.",
  "Any affiliate relationships are limited, intentional, and shared with you.",
  "Exact pricing is shared after your invite request.",
];

const inviteReasons = [
  "Keeps the experience gentle by honoring a small mentor-to-member ratio.",
  "Lets us plan thoughtful, individual attention rather than one-size fits all.",
  "Ensures invites are shared with care and a personal introduction.",
];

const betaHighlights = [
  {
    title: "What Beta Membership Includes",
    points: [
      "Full membership experience while we refine the journey together.",
      "No cost during the beta so you can focus on the care, not the fee.",
      "No obligation when the beta concludes—stay or step back with grace.",
      "Opportunity to share how the experience feels so we can keep improving.",
    ],
  },
  {
    title: "From Member to Mentor",
    points: [
      "Optional, invitation-based pathway when alignment feels right.",
      "Selection cares for readiness, communication, and shared values.",
      "Training, support, and clear scope keep mentorship grounded and calm.",
    ],
  },
  {
    title: "What Mentors Receive",
    points: [
      "Paid mentorship opportunities with flexible, remote participation.",
      "Dedicated training, resources, and ongoing support from TMBC.",
      "Continued connection to a community of thoughtful mentors.",
      "Affiliate commissions from thoughtful reviews and educational blog content.",
    ],
  },
];

function IncludesGrid() {
  return (
    <SectionBand bg="white">
      <div className={`${textCage("intro")} space-y-2`}>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Calm, editorial care</p>
        <MarketingHeading level="h2" id="membership-includes" className="tracking-[0.02em]">
          What Membership Includes
        </MarketingHeading>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {includeCards.map((card) => (
          <article
            key={card.title}
            className={`${cardBase("relative overflow-hidden p-6 md:p-8")} border border-[var(--member-border-soft)]`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--member-border-default)] bg-[var(--member-accent-subtle)] text-sm text-[var(--tmbc-charcoal)]/60">
              <span aria-hidden="true">✶</span>
            </div>
            <MarketingHeading level="h3" className="mt-5 text-[var(--tmbc-charcoal)]">
              {card.title}
            </MarketingHeading>
            <p className="mt-3 mkt-body text-[var(--tmbc-charcoal)] text-opacity-70">{card.copy}</p>
          </article>
        ))}
      </div>
    </SectionBand>
  );
}

function InvitationSection() {
  return (
    <SectionBand bg="ivory">
      <div className={`${textCage("intro")} space-y-2`}>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Invitation, thoughtfully paced</p>
        <MarketingHeading level="h2" id="membership-invitation">
          Membership & Invitation
        </MarketingHeading>
        <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
          Thoughtful access, by design. Invite-only membership keeps the community calm, personal, and made for people
          who value care over noise.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <article className={`${cardBase("p-6 md:p-8")} border border-[var(--member-border-soft)]`}>
          <MarketingHeading level="h3" className="text-[var(--tmbc-charcoal)]">
            How Pricing Works
          </MarketingHeading>
          <ul className="mt-4 space-y-3">
            {pricingNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
                <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">{note}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className={`${cardBase("p-6 md:p-8")} border border-[var(--member-border-soft)]`}>
          <MarketingHeading level="h3" className="text-[var(--tmbc-charcoal)]">
            Why Invite-Only?
          </MarketingHeading>
          <ul className="mt-4 space-y-3">
            {inviteReasons.map((reason) => (
              <li key={reason} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
                <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">{reason}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </SectionBand>
  );
}

function BetaMentorPathway() {
  return (
    <div aria-labelledby="beta-pathway" className="space-y-10">
      <div className={`${textCage("intro")} space-y-2`}>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Beta care with depth</p>
        <MarketingHeading level="h2" id="beta-pathway">
          Beta Membership & Mentor Pathway
        </MarketingHeading>
        <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">Growing with intention.</p>
        <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
          Beta testing fees are waived while we co-create the experience—there is no obligation afterward.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {betaHighlights.map((section) => (
          <article
            key={section.title}
            className={`${cardBase("flex flex-col p-6")} border border-[var(--member-border-soft)]`}
          >
            <MarketingHeading level="h3" className="text-[var(--tmbc-charcoal)]">
              {section.title}
            </MarketingHeading>
            <ul className="mt-4 space-y-3">
              {section.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
                  <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className={`${textCage("standard")} mkt-body text-[var(--tmbc-charcoal)] text-opacity-80`}>
        This model keeps TMBC focused on mentor support and member care while being transparent about the limited
        affiliate relationships that sustain the experience.
      </p>
    </div>
  );
}

function TransparencyDisclosure() {
  return (
    <div aria-labelledby="transparency-disclosure" className="space-y-6">
      <div className={`${textCage("intro")} space-y-2`}>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Clarity & care</p>
        <MarketingHeading level="h2" id="transparency-disclosure">
          Transparency & Affiliate Disclosure
        </MarketingHeading>
      </div>
      <div className={`${textCage("standard")} space-y-4`}>
        <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
          We keep our conversations open about how TMBC and mentors are supported so you can trust every recommendation.
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
            <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
              TMBC participates in select affiliate programs that align with our calm, ethical approach.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
            <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
              Mentors may earn commissions when they share educational blog posts or thoughtful reviews.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
            <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
              No product promotion is required or incentivized—mentors always lead with care.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
            <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
              Purchases are never required for members; your journey is grounded in trust, not transactions.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FinalCTA() {
  return (
    <div className="rounded-[32px] border border-[var(--member-border-soft)] bg-white/90 px-6 py-10 text-center shadow-[0_25px_60px_rgba(62,47,53,0.2)]">
      <MarketingHeading level="h2">You don’t need to do this alone.</MarketingHeading>
      <p className="mt-3 mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
        Requesting an invite is simply the start of a conversation.
      </p>
      <Button href="/request-invite" variant="primary" className="mt-6">
        Request an Invite
      </Button>
    </div>
  );
}

export default function MembershipPage() {
  return (
    <div className="bg-[var(--tmbc-ivory)]">
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      <MarketingHero
        eyebrow="Membership"
        headline="Membership, thoughtfully designed."
        lead="Personal guidance, calm planning, and ongoing support—before and after baby arrives."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        secondaryCta={{
          label: "Explore membership includes",
          href: "#membership-includes",
        }}
        imageSrc={membershipHero}
        imageAlt="Soft editorial still life with a ribbon, key, and TMBC blocks"
        priority
      />
      <IncludesGrid />
      <InvitationSection />
      <SectionBand bg="blush">
        <div className="space-y-10">
          <BetaMentorPathway />
          <div className={`${dividerRhythm()} w-20 mx-auto`} aria-hidden="true" />
          <TransparencyDisclosure />
        </div>
      </SectionBand>
      <SectionBand bg="white">
        <div className={textCage("intro")}>
          <FinalCTA />
        </div>
      </SectionBand>
    </div>
  );
}

import Button from "@/components/ui/Button";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";
import SectionDivider from "@/components/marketing/SectionDivider";
import membershipHero from "@/assets/images/membershiphero.png";
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
  "We never earn commission or rely on affiliate recommendations.",
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
    ],
  },
];

function IncludesGrid() {
  return (
    <section aria-labelledby="membership-includes" className="marketing-section space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Calm, editorial care</p>
        <h2 id="membership-includes" className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)]">
          What Membership Includes
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {includeCards.map((card) => (
          <article
            key={card.title}
            className="relative overflow-hidden rounded-[26px] border border-[var(--member-border-soft)] bg-white/90 p-6 shadow-[0_15px_45px_rgba(62,47,53,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--member-border-default)] bg-[var(--member-accent-subtle)] text-sm text-[var(--tmbc-charcoal)]/60">
              <span aria-hidden="true">✶</span>
            </div>
            <h3 className="mt-5 font-playfair text-xl tracking-[-0.01em] text-[var(--tmbc-charcoal)]">{card.title}</h3>
            <p className="mt-3 mkt-body text-[var(--tmbc-charcoal)] text-opacity-70">{card.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function InvitationSection() {
  return (
    <section aria-labelledby="membership-invitation" className="marketing-section marketing-section-wash space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Invitation, thoughtfully paced</p>
        <h2 id="membership-invitation" className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)]">
          Membership & Invitation
        </h2>
        <p className="max-w-3xl mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
          Thoughtful access, by design. Invite-only membership keeps the community calm, personal, and made for people
          who value care over noise.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[26px] border border-[var(--member-border-soft)] bg-white/90 p-6 shadow-[0_15px_40px_rgba(62,47,53,0.1)]">
          <h3 className="font-playfair text-2xl tracking-[-0.02em] text-[var(--tmbc-charcoal)]">How Pricing Works</h3>
          <ul className="mt-4 space-y-3">
            {pricingNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--member-accent-primary)]" aria-hidden="true" />
                <span className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">{note}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-[26px] border border-[var(--member-border-soft)] bg-white/90 p-6 shadow-[0_15px_40px_rgba(62,47,53,0.1)]">
          <h3 className="font-playfair text-2xl tracking-[-0.02em] text-[var(--tmbc-charcoal)]">Why Invite-Only?</h3>
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
    </section>
  );
}

function BetaMentorPathway() {
  return (
    <section aria-labelledby="beta-pathway" className="marketing-section space-y-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Beta care with depth</p>
        <h2 id="beta-pathway" className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)]">
          Beta Membership & Mentor Pathway
        </h2>
        <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">Growing with intention.</p>
        <p className="max-w-3xl mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
          Beta testing fees are waived while we co-create the experience—there is no obligation afterward.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {betaHighlights.map((section) => (
          <article
            key={section.title}
            className="flex flex-col rounded-[24px] border border-[var(--member-border-soft)] bg-white/90 p-6 shadow-[0_15px_45px_rgba(62,47,53,0.1)]"
          >
            <h3 className="font-playfair text-xl tracking-[-0.02em] text-[var(--tmbc-charcoal)]">{section.title}</h3>
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
      <p className="max-w-3xl mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
        This model allows TMBC to grow sustainably without relying on product commissions and reinvests in mentor support
        and our members’ experience.
      </p>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="marketing-section marketing-section-wash marketing-section-lush mt-16 rounded-[32px] border border-[var(--member-border-soft)] px-6 py-10 text-center shadow-[0_25px_60px_rgba(62,47,53,0.2)]">
      <h2 className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)]">You don’t need to do this alone.</h2>
      <p className="mt-3 mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
        Requesting an invite is simply the start of a conversation.
      </p>
      <Button href="/request-invite" variant="primary" className="mt-6">
        Request an Invite
      </Button>
    </section>
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
      <SectionDivider />
      <MarketingContent>
        <IncludesGrid />
        <SectionDivider />
        <InvitationSection />
        <SectionDivider />
        <BetaMentorPathway />
        <SectionDivider />
        <FinalCTA />
      </MarketingContent>
    </div>
  );
}

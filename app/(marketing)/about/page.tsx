import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingImage from "@/components/marketing/MarketingImage";
import RibbonDivider from "@/components/marketing/RibbonDivider";

const philosophy = [
  {
    title: "Invite-only by design",
    description:
      "A smaller, more attentive community lets mentors stay present and personal.",
  },
  {
    title: "Mentor-first planning",
    description:
      "Human guidance keeps decisions grounded in your life, not a generic list.",
  },
  {
    title: "Fewer decisions, better ones",
    description:
      "We slow the pace so you can choose what fits and skip what does not.",
  },
];

const whoItsFor = [
  {
    title: "Parents seeking clarity",
    description:
      "You want a steady plan and a trusted guide, not another checklist.",
  },
  {
    title: "Parents overwhelmed by options",
    description:
      "Too many lists and opinions have made things feel louder, not clearer.",
  },
  {
    title: "Parents who value guidance",
    description:
      "You want to learn with context and make calm, thoughtful choices.",
  },
];

const whatItsNot = [
  {
    title: "Not a registry",
    description:
      "We do not push products or fill lists on your behalf.",
  },
  {
    title: "Not a marketplace",
    description:
      "There is no shopping feed or urgency to buy.",
  },
  {
    title: "Not social media",
    description:
      "No algorithms, no performance, just focused support.",
  },
];

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Why Taylor-Made Baby Co."
        supportingText="We guide you through each season with calm clarity, mentor-led pacing, and intentional next steps."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How it works (gently)",
          href: "/how-it-works",
        }}
      />
      <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 px-10 py-20 md:py-32 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            About
          </p>
          <h1 className="font-serif text-2xl md:text-4xl text-[var(--tmbc-charcoal)]">
            Why Taylor-Made Baby Co.
          </h1>
        </div>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Calm preparation over consumption. Mentor-led guidance that respects your pace and priorities.
        </p>
      </section>

      <section className="grid gap-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-br from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-2">
        <div className="my-12 md:my-16">
          <MarketingImage
            variant="editorial"
            aspectRatio="4/3"
            maxWidth={520}
            lazy
            label="About - Editorial pause: calm home moment"
            page="/about"
            section="Editorial Pause"
            assetPath="TBD"
            assetPriority="med"
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            The heart of TMBC
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Calm spaces, calm decisions
          </h2>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            The experience is designed to feel like a soft landing: thoughtful guidance, slower pacing, and
            support that meets you where you are. (Even if the nursery isn’t finished yet.)
          </p>
        </div>
      </section>

      <section className="grid gap-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-white/80 px-8 py-20 md:py-32 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Real life, held gently
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Guidance that fits growing families
          </h2>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            TMBC supports you through each season — first babies, siblings, and every shift in between.
          </p>
        </div>
        <div className="my-12 md:my-16">
          <MarketingImage
            variant="editorial"
            aspectRatio="4/3"
            maxWidth={520}
            lazy
            label="About - Editorial pause: family support moment"
            page="/about"
            section="Editorial Pause"
            assetPath="TBD"
            assetPriority="med"
          />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          A visual pause that echoes the values guiding the invite.
        </p>
        <RibbonDivider />
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            The philosophy
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            The intention behind the invite
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {philosophy.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {item.title}
              </p>
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <RibbonDivider />
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 px-8 py-20 md:py-32 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Who it is for
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Parents who want guidance with grace
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {whoItsFor.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {item.title}
              </p>
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-white/80 px-8 py-20 md:py-32 shadow-[0_20px_80px_rgba(199,166,199,0.2)] marketing-section">
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          People-first moments that keep the focus on families, not founders.
        </p>
        <div className="my-12 md:my-16">
          <MarketingImage
            variant="editorial"
            aspectRatio="4/5"
            maxWidth={520}
            lazy
            label="About - Editorial pause: people-first moment"
            page="/about"
            section="Editorial Pause"
            assetPath="TBD"
            assetPriority="med"
          />
        </div>
      </section>

      <CTARibbon
        headline="Invite-only, with care"
        supportingText="A calm, mentor-led experience for parents who want clarity. (And a little breathing room.)"
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
    </div>
  </>
  );
}

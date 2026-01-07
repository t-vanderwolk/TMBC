import CTARibbon from "@/components/marketing/CTARibbon";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";
import RibbonDivider from "@/components/marketing/RibbonDivider";

const benefits = [
  {
    title: "Mentor-moderated rooms",
    description:
      "Focused spaces that stay kind, on-topic, and useful.",
  },
  {
    title: "Monthly mentor circles",
    description:
      "Small gatherings that feel calm and supportive, not performative.",
  },
  {
    title: "Quiet, thoughtful follow-ups",
    description:
      "Mentors summarize insights so the conversation stays clear.",
  },
];

export default function ConnectPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Connect pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="You’re not meant to do this alone."
        supportingText="A supportive community of parents, mentors, and professionals navigating pregnancy and early parenthood together — honestly, kindly, and without comparison. (No one’s keeping score.)"
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (quietly)",
          href: "/how-it-works",
        }}
      />
      <RibbonDivider />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)] text-base md:text-lg">
      <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Connect
          </p>
        </div>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it supports parents
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A calm circle you can trust
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="marketing-card bg-[var(--tmbc-ivory)]/80 p-5"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {benefit.title}
              </p>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-65">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-32">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A gentle look at how conversations stay focused and kind.
        </p>
      </section>

      <CTARibbon
        headline="A calm circle is waiting"
        supportingText="Invite-only keeps the community thoughtful and mentor-led. (You can lurk first.)"
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
        tone="medium"
      />
      {/* TODO: Expand Connect pillar with mentor circle previews and room rituals. */}
        </div>
      </MarketingContent>
    </>
  );
}

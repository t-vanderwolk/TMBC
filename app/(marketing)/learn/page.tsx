import Link from "next/link";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ModuleSpotlightCard from "@/components/marketing/ModuleSpotlightCard";

const learningFocus = [
  {
    title: "Paced guidance",
    description:
      "We surface what matters this week so the Academy feels gentle, not like a load of homework.",
  },
  {
    title: "Context first",
    description:
      "Each touchpoint explains why a topic matters for you, then offers the optional tools when you want them.",
  },
  {
    title: "Only what you need",
    description:
      "The rhythm is modular — revisit nursery, gear, and postpartum touchpoints whenever curiosity or calm calls for it.",
  },
];

const mentorSupport = [
  {
    title: "Guides who listen",
    description:
      "Mentors meet you where you are, highlight the right details, and quietly honor your pace.",
  },
  {
    title: "Check-ins, not checklists",
    description:
      "Short, thoughtful prompts help you drop the noise and keep the focus on the next meaningful step.",
  },
  {
    title: "Contextual care",
    description:
      "Decisions stay personal because mentors remind you of the why, not just the what.",
  },
];

const learnFit = [
  {
    title: "You’re curious but cautious",
    description:
      "You want clarity without feeling pushed to keep up, and you trust mentors to guide a steady pace.",
  },
  {
    title: "You study when it feels right",
    description:
      "Modules sit beside your daily life — dip in, reflect, and step away when the moment calls for rest.",
  },
  {
    title: "You prefer listening over scrolling",
    description:
      "You value human context, conversation, and quiet reminders more than endless video playlists.",
  },
];

export default function LearnPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/section-background-learning-flow.png"
        imageAlt="Educational hero artwork for the Learn pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="Learning is the calmest way to start."
        supportingText="We keep the Academy human, paced, and optional so you learn exactly what matters for your season with a mentor who respects your rhythm."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (gently)",
          href: "/how-it-works",
        }}
      />
      <RibbonDivider />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What learning looks like here
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                The Academy is steady, contextual, and always optional.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                We translate research and experience into mentor-led reflections so you can absorb what matters most
                without feeling like you need to complete a course catalog.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {learningFocus.map((focus) => (
                <div key={focus.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {focus.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{focus.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Module spotlight
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                One guided moment from the Academy
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The Car Seat Masterclass walks you through choices with mentor commentary, so it feels like a conversation
                rather than a lecture. It is an invitation to pause, learn, and return with questions.
              </p>
            </div>
            <div className="mt-10">
              <ModuleSpotlightCard />
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                How mentors support learning
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Mentors keep the learning gentle and human.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {mentorSupport.map((signal) => (
                <div key={signal.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {signal.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{signal.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Who this is for
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                For people who want relief, not another curriculum.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {learnFit.map((fit) => (
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
                Closing reassurance
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Learning sits beside planning, connecting, and reflecting with calm continuity.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The Academy is a calm, guided space you return to as questions arise, so you can keep moving without
                feeling overwhelmed.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
              >
                Request Your Invite
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}

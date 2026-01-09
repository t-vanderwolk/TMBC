import { Suspense } from "react";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import InviteSection from "@/components/marketing/InviteSection";

const noiseNotes = [
  "Every checklist shouts louder than the midnight spit-up clean-up, making your next decision feel urgent.",
  "Feeds full of curated nurseries leave your inbox untouched and your sleep schedule in a different timezone.",
  "Decision fatigue settles in when every screen demands a \"complete\" tap while you're still wondering what day it is.",
];

const quietResponse = [
  "Mentors ask before advising, so your rhythm decides what matters—not the loudest notification while baby slumbers on your lap.",
  "We keep the care calm, private, and steady, even when you're juggling a million \"why is this so hard?\" moments in parenthood.",
  "Intentional pacing lets each chapter land before the next one arrives, so nothing feels rushed while you're still changing a blowout.",
];

const whatThisIsntHighlights = [
  "This is not a countdown, a sales pitch, or a guilt trip disguised as urgency.",
  "You will not be pushed into every trending purchase because someone tagged it with \"parent hack.\"",
  "There's no pressure to sprint—this flow waits until you can actually breathe between feedings.",
];

const differenceHighlights = [
  "Human mentors keep the care personal, not algorithmic.",
  "Sequence over urgency—nothing moves until the previous chapter feels settled, even if baby just greeted you with a surprise blowout.",
  "Advocacy over selling keeps your questions in focus.",
  "Ongoing support means someone calm is checking in while you juggle spit-up and exhaustion.",
];

const rhythms = [
  "Learn—clarify what your baby actually needs instead of doom-scrolling another parenting thread.",
  "Plan—make quiet choices with a mentor after you've had time to register how the night actually went.",
  "Connect—show up to rooms that feel like a trusted note instead of another noisy chat.",
  "Reflect—keep keepsakes that read like letters, not a never-ending notification feed.",
];

const partnerLogos = [
  { file: "baby-quip-logo.svg", alt: "Baby Quip" },
  { file: "angelbliss-logo.avif", alt: "Angelbliss" },
  { file: "babyshusher-logo.png", alt: "Baby Shusher" },
  { file: "bellalunatoys.png", alt: "Bellaluna Toys" },
  { file: "ergobabylogo.png", alt: "Ergobaby" },
  { file: "happiestbaby-logo.png", alt: "Happiest Baby" },
  { file: "mustela-logo.png", alt: "Mustela" },
  { file: "tommee-tippee-logo.png", alt: "Tommee Tippee" },
];

const whatThisBlocks = [
  { title: "What this really is for parenthood", copy: quietResponse },
  { title: "What this is not for parenthood", copy: whatThisIsntHighlights },
];

export default function HomePage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. marketing hero"
        imageWidth={1536}
        imageHeight={1024}
        headline="Calmer prep for babyhood ahead"
        supportingText="Mentors slow the rhythm so you can prep for parenthood without googling at 2 a.m. while the baby spits up on your shirt."
        primaryCta={{
          label: "Start preparing",
          href: "/request-invite",
          className:
            "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "Learn how we guide you",
          href: "/how-it-works",
          className: "text-[0.65rem] uppercase tracking-[0.35em] underline text-[var(--tmbc-charcoal)]/80",
        }}
        priority
      />
      <RibbonDivider />

      <MarketingContent>
        <section className="marketing-section marketing-card bg-white/90 px-6 py-16 md:px-12 md:py-24 mt-16">
          <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-2">
            {whatThisBlocks.map((block) => (
              <div key={block.title} className="space-y-4">
                <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  {block.title}
                </p>
                <div className="space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                  {block.copy.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-6 py-16 md:px-12 md:py-24 mt-24">
          <div className="max-w-5xl mx-auto space-y-6 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              SYSTEM FLOW
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Learn, plan, connect, reflect—each stage waits until you can actually feel the next step with your baby in your arms.
            </h2>
            <p className="max-w-3xl mx-auto text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              The TMBC flow keeps you oriented through babyhood so every choice lands with clarity.
            </p>
          </div>
          <div className="mt-10 space-y-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {rhythms.map((rhythm) => (
              <div key={rhythm} className="marketing-card bg-white/80 p-6">
                <p>{rhythm}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-32">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Why it feels loud
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              The noise is louder than the baby cues.
            </h2>
            <div className="mt-8 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {noiseNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-16 md:py-24 mt-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              What makes this different
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Calm care, steady context for parenthood.
            </h2>
          </div>
          <div className="mt-8 space-y-6 leading-relaxed text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            {differenceHighlights.map((highlight) => (
              <p key={highlight}>• {highlight}</p>
            ))}
          </div>
        </section>

        <section className="marketing-section marketing-card bg-white/80 px-6 py-16 md:px-12 md:py-24 mt-32 opacity-80">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Partners keeping it calm
            </p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 items-center justify-center">
              {partnerLogos.map((logo) => {
                const logoSrc = `/api/logos/${encodeURIComponent(logo.file)}`;
                return (
                  <div key={logo.file} className="flex items-center justify-center p-4">
                    <img
                      src={logoSrc}
                      alt={logo.alt}
                      width={140}
                      height={60}
                      className="h-14 w-auto object-contain"
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[var(--tmbc-charcoal)] text-opacity-70">
              Curious about the mentors holding this steady space while baby naps? <Link className="underline" href="/about">Meet them on the About page.</Link>
            </p>
          </div>
        </section>

        <div className="mt-20">
          <Suspense fallback={<div className="min-h-[24rem]" />}>
            <InviteSection />
          </Suspense>
        </div>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/80 px-8 py-20 md:py-28 mt-24 mb-16">
          <div className="max-w-3xl mx-auto space-y-5 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Ready when baby lets you breathe
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Care that keeps pace with your parenting rhythm.
            </h2>
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Request an invite when the baby schedule lets you breathe; we'll keep leaning in while you juggle feedings.
            </p>
            <Link
              href="/request-invite"
              className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
            >
              Plan calmly
            </Link>
          </div>
        </section>
      </MarketingContent>
    </>
  );
}

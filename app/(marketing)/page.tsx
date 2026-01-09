import { Suspense } from "react";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import InviteSection from "@/components/marketing/InviteSection";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

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

const systemStages = [
  {
    title: "Learn",
    heading: "Clarify what matters before you plan anything for baby",
    description:
      "We slow the flood of opinions so you learn what decisions are actually coming instead of Googling with the baby on your hip.",
    micro: "This stage keeps you ahead of the noise—no more midnight research rabbit holes.",
    preview: {
      src: "/assets/images/academydashboardpreview.png",
      alt: "Taylor-Made Academy dashboard preview",
    },
  },
  {
    title: "Plan",
    heading: "Co-create a calm plan after you understand the lay of the land",
    description:
      "Mentors help you pace the purchases and timelines so every choice is grounded in your household rhythm, not a trending checklist.",
    micro: "Plan quietly with someone who knows how to coach you past decision fatigue.",
    preview: {
      src: "/assets/images/planpreview.png",
      alt: "Planning workspace preview",
    },
  },
  {
    title: "Connect",
    heading: "Step into moderated rooms that meet you where you are",
    description:
      "Connect with other parents while mentors keep the energy low and the conversation useful instead of performative.",
    micro: "These sessions are distraction-free—no loud feeds, just thoughtful presence.",
    preview: {
      src: "/assets/images/connectpreview.png",
      alt: "Community connection preview",
    },
  },
  {
    title: "Reflect",
    heading: "Capture what you learned and keep it steady",
    description:
      "We collect reflections so mentors can see what worked, what felt weird, and what still needs attention before you move forward.",
    micro: "Reflection feels like a letter, not another notification badge.",
    preview: {
      src: "/assets/images/reflectpreview.png",
      alt: "Reflection & baby book preview",
    },
  },
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
      <section className="py-24 flex justify-center">
        <div className="w-full max-w-[520px] flex justify-center">
          <img
            src="/assets/images/invite-only.png"
            alt="Invite-only access calming signal"
            className="w-full rounded-2xl"
          />
        </div>
      </section>
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
          <div className="mt-10 space-y-8">
            {systemStages.map((stage, index) => (
              <div key={stage.title} className="flex flex-col gap-3 rounded-[24px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {stage.title}
                  </p>
                  <span className="text-xs font-mono text-[var(--tmbc-charcoal)] text-opacity-60">
                    {`0${index + 1}`}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[var(--tmbc-charcoal)]">{stage.heading}</h3>
                <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">{stage.description}</p>
                <p className="text-[0.7rem] text-[var(--tmbc-charcoal)] text-opacity-60">{stage.micro}</p>
                {stage.preview && (
                  <MobilePreviewImage
                    src={stage.preview.src}
                    alt={stage.preview.alt}
                    width={240}
                    height={520}
                    containerClassName="mt-4 w-full max-w-[240px] self-center"
                  />
                )}
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

          <div className="py-24 flex justify-center">
            <div className="w-full max-w-[520px]">
              <img
                src="/assets/images/baby-booties.jpeg"
                alt="Small booties resting gently, offering a quiet pause"
                className="w-full rounded-2xl"
              />
            </div>
          </div>

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

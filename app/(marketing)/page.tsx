import Image from "next/image";
import Link from "next/link";
import QuotePanel from "@/components/marketing/QuotePanel";
import TwoColCards from "@/components/marketing/TwoColCards";
import PartnerLogos from "@/components/marketing/PartnerLogos";
import FinalCTA from "@/components/marketing/FinalCTA";
import homeHero from "@/assets/images/homehero2.png";

const pillarOrder: Array<"learn" | "plan" | "connect" | "reflect"> = [
  "learn",
  "plan",
  "connect",
  "reflect",
];

const pillarDetails = {
  learn: {
    title: "Learn",
    subheading: "Understanding comes before buying.",
    body: [
      "This is where everything starts. Expecting parents are calmly walked through the major categories of baby gear — strollers, car seats, carriers, nursery items, feeding, and more — in a clear, structured way.",
      "The goal isn’t shopping. It’s understanding what each category is designed to do, how it fits into daily life, and which ones may or may not apply to your space, routines, and priorities. Once parents understand the landscape, decisions feel easier — and far more personal.",
    ],
  },
  plan: {
    title: "Plan",
    subheading: "Thoughtful decisions, made together.",
    body: [
      "After parents clarify what matters to them, they work one-on-one with a mentor to build a thoughtful plan and decide which specific items belong on their registry.",
      "This happens inside an interactive workspace that auto-saves, so nothing feels rushed or lost. Planning is collaborative, paced, and grounded in real-world use — not trends, pressure, or endless scrolling.",
    ],
  },
  connect: {
    title: "Connect",
    subheading: "Learn alongside people in the same season.",
    body: [
      "Parents following the same learning path can connect inside the TMBC community — quiet, moderated chat rooms designed for focused conversation.",
      "Instead of overwhelming feeds or open forums, this space is intentionally smaller and calmer. Parents ask questions, compare notes, and learn alongside others who are at the same stage, using the same framework.",
    ],
  },
  reflect: {
    title: "Reflect",
    subheading: "A private record of this season.",
    body: [
      "Reflect is a personal time vault — a modern baby book designed to hold both milestones and in-between moments.",
      "Parents can save ultrasound photos, names they’re considering, notes about this stage, screenshots of loved ones’ reactions, voice notes, and daily reflections. When they’re ready, they can seal the vault and preserve it as a finished chapter of this season.",
    ],
  },
};

const howItWorksSteps = [
  {
    number: "01",
    title: "Learn",
    description: "Calm education in plain language. No pressure to buy.",
    preview: {
      src: "/images/marketing/step-learn.png",
      alt: "Academy dashboard showing calm baby planning content",
    },
  },
  {
    number: "02",
    title: "Plan",
    description: "One-on-one mentor guidance to build a thoughtful plan and registry.",
    preview: {
      src: "/images/marketing/step-plan.png",
      alt: "Guided planning workspace with checklist preview",
    },
  },
  {
    number: "03",
    title: "Connect",
    description: "Ongoing support from real people.",
    preview: {
      src: "/images/marketing/step-connect.png",
      alt: "Community connection preview",
    },
  },
  {
    number: "04",
    title: "Reflect",
    description: "Capture decisions, notes, and memories.",
    preview: {
      src: "/images/marketing/step-reflect.png",
      alt: "Reflection and memory-keeping preview",
    },
  },
];

const whatWeDont = [
  "We don't sell products.",
  "We don't auto-generate registries.",
  "We don't rush decisions.",
];

const twoColReceives = [
  "Personalized baby-prep roadmap",
  "One-on-one mentor guidance",
  "Registry planning without pressure",
  "Calm education",
  "Ongoing support as needs evolve",
];

const whoThisIsFor = {
  for: ["First-time parents", "Overwhelmed planners", "Families who want clarity"],
  notFor: ["Quick shopping lists", "Automated recommendations", "Influencer-driven advice"],
};

const noiseNotes = [
  "Every checklist shouts louder than the midnight spit-up clean-up, making your next decision feel urgent.",
  "Feeds full of curated nurseries leave your inbox untouched and your sleep schedule in a different timezone.",
  "Decision fatigue settles in when every screen demands a \"complete\" tap while you're still wondering what day it is.",
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

const finalMicroBullets = [
  "We review every request before making a match.",
  "Mentor introductions happen by video or DM, never automation.",
  "Support stays private and paced to your schedule.",
];

export default function HomePage() {
  const quoteText = noiseNotes.join(" ");

  return (
    <main className="min-h-screen bg-[#fbf7f4] text-neutral-900">
      <section className="relative -mt-6 sm:-mt-10 pt-8 sm:pt-10">
        <div className="relative overflow-hidden">
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <div className="relative h-[520px] sm:h-[640px]">
              <Image
                src={homeHero}
                alt="Taylor-Made Baby Co. marketing hero"
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fbf7f4] to-transparent" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-[44ch]">
              <p className="text-[11px] tracking-[0.34em] uppercase text-neutral-500">
                Calm, personal guidance for expecting parents
              </p>
              <h1 className="mt-3 text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.02em] text-neutral-900">
                Baby prep, without the overwhelm.
              </h1>
              <p className="mt-6 text-[16px] sm:text-[18px] leading-relaxed text-neutral-700">
                A calm, mentor-guided way to learn what baby gear actually does, plan what you truly need, and feel
                supported every step of the way.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row items-start">
                <Link
                  href="/request-invite"
                  className="flex h-11 items-center justify-center rounded-full bg-[var(--tmbc-charcoal)] px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Request an Invite
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex h-11 items-center justify-center rounded-full border border-neutral-300 bg-white/60 px-6 text-sm font-semibold text-neutral-900 transition hover:bg-white/80"
                >
                  Explore the Experience
                </Link>
              </div>
              <p className="mt-6 text-[15px] leading-relaxed text-neutral-500 italic max-w-prose">
                No panic scrolling. Just the next calm step.
              </p>
              <p className="mt-6 text-[12px] tracking-[0.22em] uppercase text-neutral-500">
                Invite-only baby planning for modern parents.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="h-14" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <section className="py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            {pillarOrder.map((pillarKey) => {
              const pillar = pillarDetails[pillarKey];
              return (
                <article
                  key={pillarKey}
                  className="rounded-3xl border border-neutral-200 bg-white/70 p-8 shadow-sm"
                >
                  <h3 className="text-2xl sm:text-3xl tracking-tight text-neutral-900">{pillar.title}</h3>
                  <p className="mt-2 text-base sm:text-lg font-medium text-neutral-700">{pillar.subheading}</p>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-600 max-w-prose">
                    {pillar.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl leading-tight tracking-tight text-neutral-900">
              Taylor-Made Baby Co. is a private baby-planning service.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-neutral-600">
              Think of it as a personal guide who helps you prepare for life with a baby — without endless Googling,
              pressure, or guesswork.
            </p>
            <ul className="mt-6 space-y-3 text-base sm:text-lg text-neutral-700">
              {whatWeDont.map((line) => (
                <li key={line} className="flex gap-3 items-start">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl sm:text-4xl tracking-tight text-neutral-900">HOW IT WORKS</h2>
          </div>
          <div className="mt-2 h-px w-full bg-neutral-200/60" />
          <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-2 lg:gap-8">
            {howItWorksSteps.map((step) => (
              <article
                key={step.number}
                className="group flex h-full flex-col rounded-3xl border border-neutral-200 bg-white/70 p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
              >
                <div className="min-h-[168px] md:min-h-[176px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] tracking-[0.34em] uppercase text-neutral-500">Step {step.number}</p>
                    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-neutral-600">
                      {step.title}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-[12px] tracking-[0.18em] uppercase text-neutral-500">
                    {step.number === "01"
                      ? "Clarity before shopping."
                      : step.number === "02"
                      ? "Decisions with a human."
                      : step.number === "03"
                      ? "Support without the noise."
                      : "Keep what matters."}
                  </p>
                  <p className="mt-2 min-h-[44px] text-[14px] leading-relaxed text-neutral-600">{step.description}</p>
                </div>
                <div className="mt-auto pt-6">
                  <div className="rounded-2xl border border-neutral-200 bg-white/60 p-4">
                    <div className="relative mx-auto w-full max-w-[320px]">
                      <div className="relative aspect-[9/19] overflow-hidden rounded-xl bg-neutral-50">
                        <img
                          src={step.preview.src}
                          alt={step.preview.alt}
                          className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <TwoColCards receives={twoColReceives} who={whoThisIsFor} />
        </section>

        <section className="py-16 sm:py-20">
          <QuotePanel quote={quoteText} closing="TMBC meets you with calm structure—so the next step never feels urgent." />
        </section>

        <section className="py-16 sm:py-20">
          <PartnerLogos logos={partnerLogos} />
        </section>

        <section className="py-16 sm:py-20">
          <FinalCTA
            title="Care that keeps pace with your parenting rhythm."
            subtitle="Request an invite when the baby schedule lets you breathe; we’ll keep leaning in while you juggle feedings."
            bullets={finalMicroBullets}
            ctaLabel="Request an Invite"
            imageSrc="/images/marketing/invite-flow.png"
            imageAlt="Invite-only onboarding process from request to mentorship and guided experience"
          />
        </section>
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import homepageHero from "@/assets/images/homepagehero.png";
import inviteOnlyImage from "@/assets/images/inviteonly.png";
import PillarImagePacemaker from "@/components/marketing/PillarImagePacemaker";
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-16 sm:py-20";
const eyebrow = "text-[11px] tracking-[0.34em] uppercase text-neutral-500";
const h2 = "mt-4 text-3xl sm:text-4xl leading-tight tracking-tight text-neutral-900";
const lead = "mt-6 text-[16px] sm:text-[18px] leading-relaxed text-neutral-700 max-w-prose";
const card = "rounded-3xl border border-neutral-200 bg-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.06)]";
const cardPad = "p-8 sm:p-10";
const cardTitle = "text-xl font-semibold text-neutral-900";
const cardBody = "mt-3 text-[15px] leading-relaxed text-neutral-600";
const body = "mt-4 text-[16px] leading-relaxed text-neutral-700";
const small = "text-[14px] leading-relaxed text-neutral-600";
const divider = "mt-14 h-px w-full bg-neutral-200/60";

const pillarOrder: Array<"learn" | "plan" | "connect" | "reflect"> = [
  "learn",
  "plan",
  "connect",
  "reflect",
];

const pillarDetails = {
  learn: {
    image: {
      src: learnPillar,
      alt: "Open book with soft flowing lines, representing learning and understanding",
    },
    title: "Learn",
    subheading: "Understanding comes before buying.",
    body: [
      "This is where everything starts. Expecting parents are calmly walked through the major categories of baby gear — strollers, car seats, carriers, nursery items, feeding, and more — in a clear, structured way.",
      "The goal isn’t shopping. It’s understanding what each category is designed to do, how it fits into daily life, and which ones may or may not apply to your space, routines, and priorities. Once parents understand the landscape, decisions feel easier — and far more personal.",
    ],
  },
  plan: {
    image: {
      src: planPillar,
      alt: "Spiral notebook on linen surface, representing thoughtful planning",
    },
    title: "Plan",
    subheading: "Thoughtful decisions, made together.",
    body: [
      "After parents clarify what matters to them, they work one-on-one with a mentor to build a thoughtful plan and decide which specific items belong on their registry.",
      "This happens inside an interactive workspace that auto-saves, so nothing feels rushed or lost. Planning is collaborative, paced, and grounded in real-world use — not trends, pressure, or endless scrolling.",
    ],
  },
  connect: {
    image: {
      src: connectPillar,
      alt: "Soft abstract conversation shapes, representing connection and support",
    },
    title: "Connect",
    subheading: "Learn alongside people in the same season.",
    body: [
      "Parents following the same learning path can connect inside the TMBC community — quiet, moderated chat rooms designed for focused conversation.",
      "Instead of overwhelming feeds or open forums, this space is intentionally smaller and calmer. Parents ask questions, compare notes, and learn alongside others who are at the same stage, using the same framework.",
    ],
  },
  reflect: {
    image: {
      src: reflectPillar,
      alt: "Closed linen notebook with ribbon bookmark, representing reflection and continuity",
    },
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
    <main className="min-h-screen bg-[#fef9f6] text-[#1F1C1A]">
      <section className="relative w-screen min-h-[520px] lg:min-h-[680px] overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0">
          <Image
            src={homepageHero}
            alt="Taylor-Made Baby Co. marketing hero"
            fill
            priority
            sizes="100vw"
            className="object-fill object-right lg:object-[80%_50%]"
          />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-12">
          <div className="max-w-xl space-y-8 pt-10">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#5B4A44]">Calm, personal guidance for expecting parents</p>
            <h1 className="font-playfair text-[40px] leading-[1.18] tracking-tight text-[#2a1c18] sm:text-[48px] lg:text-[54px]">
              Baby prep,
              <br />
              without the overwhelm.
            </h1>
            <p className="text-lg leading-relaxed text-[#3a2c2b] max-w-[46ch]">
              A calm, mentor-guided way to learn what baby gear actually does, plan what you truly need, and feel
              supported every step of the way.
            </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/request-invite"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--tmbc-mauve)] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] text-[#3c1c21] transition hover:bg-[var(--tmbc-mauve)]/90 sm:w-auto"
                >
                  Request an Invite
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[var(--tmbc-mauve)] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] text-[#3c1c21] transition hover:border-[var(--tmbc-mauve)]/80 hover:text-[#3c1c21] sm:w-auto"
                >
                  Explore the Experience
                </Link>
              </div>
            <div className="space-y-1 text-sm text-[#3f3433]">
              <p className="italic">No panic scrolling. Just the next calm step.</p>
              <p className="tracking-[0.22em] uppercase text-xs">Invite-only baby planning for modern parents.</p>
            </div>
          </div>
        </div>
      </section>
      <div className={`${container} mt-16 sm:mt-20`}>
        <div className={divider} />
      </div>

      <section className="py-24 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pillarOrder.map((pillarKey) => {
              const pillar = pillarDetails[pillarKey];
              return (
                <article
                  key={pillarKey}
                  className="group flex h-full flex-col gap-6 rounded-[24px] bg-[#fcfaf7] p-6 sm:p-7"
                >
                  <PillarImagePacemaker src={pillar.image.src} alt={pillar.image.alt} variant={pillarKey} />
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.34em] text-[#7b6864]">{pillar.title}</p>
                    <h3 className="font-playfair text-[26px] leading-[1.2] text-[#1f1a19]">{pillar.subheading}</h3>
                    <div className="space-y-3 text-[15px] leading-relaxed text-[#3d312f]">
                      {pillar.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <div className={container}>
        <div className={divider} />
      </div>

      <section className="py-28 sm:py-32">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 sm:px-6">
          <div className="relative z-10 max-w-xl">
            <h2 className="font-playfair text-[38px] sm:text-[44px] leading-tight mb-6">Taylor-Made Baby Co. is a private baby-planning service.</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Think of it as a personal guide who helps you prepare for life with a baby — without endless Googling, pressure, or guesswork.
            </p>
            <ul className="space-y-3 text-neutral-600">
              {whatWeDont.map((line) => (
                <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-neutral-700">
                  <span className="mt-2 h-2 w-2 rounded-full bg-neutral-300" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs tracking-[0.4em] uppercase text-neutral-400">
              Clarity first. Always.
            </p>
          </div>
            <div className="relative">
              <div
                className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-neutral-50 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-transform duration-700 ease-out hover:scale-[1.015]"
              >
                <Image
                  src={inviteOnlyImage}
                  alt="Invitation-only baby planning with a guided, intentional approach"
                  fill
                  sizes="(min-width: 1024px) 520px, 90vw"
                  priority={false}
                  className="object-contain p-8"
                />
              </div>
            </div>
        </div>
      </section>
      <div className={container}>
        <div className={divider} />
      </div>

      <section className={sectionY}>
        <div className={container}>
          <h2 className={h2}>HOW IT WORKS</h2>
          <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-2">
            {howItWorksSteps.map((step) => (
              <article
                key={step.number}
                className="group flex h-full flex-col rounded-3xl border border-neutral-200 bg-white/70 p-7 shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
              >
                <div className="min-h-[176px] space-y-3">
                  <p className={eyebrow}>Step {step.number}</p>
                  <h3 className="text-[22px] font-semibold text-neutral-900">{step.title}</h3>
                  <p className="text-[12px] tracking-[0.18em] uppercase text-neutral-500">
                    {step.number === "01"
                      ? "Clarity before shopping."
                      : step.number === "02"
                      ? "Decisions with a human."
                      : step.number === "03"
                      ? "Support without the noise."
                      : "Keep what matters."}
                  </p>
                  <p className={cardBody}>{step.description}</p>
                </div>
                <div className="mt-auto pt-6">
                  <div className="rounded-2xl border border-neutral-200 bg-white/60 p-4">
                    <div className="relative mx-auto w-full max-w-[340px]">
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
        </div>
      </section>
      <div className={container}>
        <div className={divider} />
      </div>

      <section className={sectionY}>
        <div className={container}>
          <div className={`${card} ${cardPad}`}>
            <p className="text-[18px] leading-relaxed text-neutral-700 max-w-[70ch]">{quoteText}</p>
            <p className="mt-6 text-[12px] tracking-[0.22em] uppercase text-neutral-500">— TMBC</p>
          </div>
        </div>
      </section>
      <div className={container}>
        <div className={divider} />
      </div>

      <section className={sectionY}>
        <div className={container}>
          <div className="rounded-3xl border border-neutral-200 bg-white/70 px-6 py-8">
            <p className="text-[11px] tracking-[0.34em] uppercase text-neutral-500 text-center">Trusted by quiet prep partners</p>
            <div className="mt-10 grid items-center gap-x-12 gap-y-10 grid-cols-4 lg:grid-cols-8">
              {partnerLogos.map((logo) => (
                <div key={logo.file} className="flex items-center justify-center">
                  <img
                    src={`/api/logos/${logo.file}`}
                    alt={logo.alt}
                    loading="lazy"
                    className="mx-auto max-h-10 w-auto opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className={container}>
        <div className={divider} />
      </div>

      <section className={sectionY}>
        <div className={`${container} grid gap-12 lg:grid-cols-2 lg:items-center`}>
          <div>
            <p className={eyebrow}>Ready when baby lets you breathe</p>
            <h2 className={h2}>Care that keeps pace with your parenting rhythm.</h2>
            <p className={lead}>
              Request an invite when the baby schedule lets you breathe; we’ll keep leaning in while you juggle feedings.
            </p>
            <ul className="mt-8 space-y-3 max-w-prose">
              {finalMicroBullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-[15px] leading-relaxed text-neutral-600">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/request-invite"
                className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
              >
                Request an Invite
              </Link>
            </div>
            <div className="mt-10">
              <p className="text-[12px] tracking-[0.22em] uppercase text-neutral-500">Have an invite code?</p>
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="h-11 w-full rounded-full border border-neutral-300 bg-white/70 px-5 text-[15px] outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <button className="h-11 rounded-full border border-neutral-300 bg-white/60 px-6 text-sm font-semibold text-neutral-900 hover:bg-white/80">
                  Apply Code
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[520px] rounded-[32px] overflow-hidden ring-1 ring-black/5 bg-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/marketing/invite-flow.png"
                  alt="Invite-only onboarding process from request to mentorship and guided experience"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

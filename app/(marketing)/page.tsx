import Image from "next/image";
import Link from "next/link";
import homepageHero from "@/assets/images/homepagehero.png";
import homepageHeroMobile from "@/assets/images/homepageheromobile.png";
import editorialNursery from "@/assets/images/editorial-experience-hero-nursery.jpg";
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-16 sm:py-20";
const eyebrow = "text-[11px] tracking-[0.34em] uppercase text-neutral-500";
const h2 = "mt-4 text-3xl sm:text-4xl leading-tight tracking-tight text-neutral-900";
const lead = "mt-6 text-[16px] sm:text-[18px] leading-relaxed text-neutral-700 max-w-prose";
const card = "rounded-3xl border border-neutral-200 bg-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.06)]";
const cardPad = "p-8 sm:p-10";
const divider = "my-16 h-px w-full bg-neutral-200/60";

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

const finalMicroBullets = [
  "We review every request before making a match.",
  "Mentor introductions happen by video or DM, never automation.",
  "Support stays private and paced to your schedule.",
];

export default function HomePage() {
  const quoteText = noiseNotes.join(" ");

  return (
    <main className="min-h-screen bg-[#fef9f6] text-[#1F1C1A]">
      <section className="relative w-screen min-h-[460px] sm:min-h-[520px] lg:min-h-[680px] overflow-hidden pt-20 pb-20 sm:py-20 lg:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 block sm:hidden">
            <Image
              src={homepageHeroMobile}
              alt="Taylor-Made Baby Co. mobile hero — calm baby planning invitation"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 100vw"
              className="object-cover object-right"
            />
          </div>
          <div className="absolute inset-0 hidden sm:block">
            <Image
              src={homepageHero}
              alt="Taylor-Made Baby Co. marketing hero"
              fill
              priority
              sizes="100vw"
              className="object-fill object-right lg:object-[80%_50%]"
            />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 lg:pt-16">
          <div className="relative max-w-xl pt-0 sm:pt-8 md:pt-0 lg:pt-0 space-y-8">
              <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 opacity-80 mb-3 lg:mb-4">
                Calm, personal guidance for expecting parents
              </p>
              <h1 className="font-playfair text-[40px] leading-[1.15] text-neutral-900 mb-4 lg:mb-6 max-w-[14ch] lg:text-[60px]">
                Baby prep,
                <br />
                without the overwhelm.
              </h1>
              <p className="max-w-md text-[15px] leading-relaxed text-neutral-700 lg:text-[17px]">
                A calm, mentor-guided way to learn what baby gear actually does, plan what you truly need, and feel
                supported every step of the way.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
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
      <div className={divider} />
      <section className="py-28 sm:py-32">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 sm:px-6">
          <div className="relative z-10 max-w-xl">
            <h2 className="font-playfair text-[38px] sm:text-[44px] leading-tight mb-6">Taylor-Made Baby Co. is a private baby-planning service.</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Think of it as a personal guide that helps you prepare for life with a baby — without endless Googling, pressure, or guesswork.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Taylor-Made Baby Co. is intentionally invite-only. Not to create barriers — but to protect the experience.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-6">
              We work with a limited number of families at a time so that guidance stays thoughtful, personal, and unrushed. Every member is supported by real mentors, real conversations, and real context — not algorithms or volume-based recommendations.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Because of that:
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
              Invite-only access allows us to stay present, human, and deeply intentional — ensuring that every parent who joins receives clarity, not noise.
            </p>
            <p className="mt-3 text-xs tracking-[0.4em] uppercase text-neutral-400">
              Clarity first. Always.
            </p>
          </div>
            <div className="relative">
              <div
                className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-neutral-50 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-transform duration-700 ease-out hover:scale-[1.015]"
              >
                <Image
                  src={editorialNursery}
                  alt="Calm, neutral nursery with soft textures, natural light, and intentional design details"
                  fill
                  sizes="(min-width: 1024px) 520px, 90vw"
                  priority={false}
                  unoptimized
                  className="object-contain p-8"
                />
              </div>
            </div>
        </div>
      </section>
      <section className="py-24 sm:py-28">
        <div className="px-4 sm:px-6">
          <div className={container}>
            <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-2">
              {pillarOrder.map((pillarKey) => {
                const pillar = pillarDetails[pillarKey];
                const pillarLink = `/${pillarKey}`;
                return (
                  <article
                    key={pillarKey}
                    className="rounded-3xl border border-neutral-200 bg-white/70 p-8 sm:p-10 shadow-[0_18px_50px_rgba(0,0,0,0.06)] flex h-full flex-col"
                  >
                    <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white/60">
                      <div className="aspect-[16/10] relative">
                        <Image
                          src={pillar.image.src}
                          alt={pillar.image.alt}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900">{pillar.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 max-w-prose">{pillar.body[0]}</p>
                    <Link
                      href={pillarLink}
                      className="mt-6 text-[12px] tracking-[0.22em] uppercase text-neutral-600 transition hover:text-neutral-900"
                    >
                      Explore {pillar.title} →
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <div className={divider} />
      <PartnerLogoCarousel />
      <div className={divider} />
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
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
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

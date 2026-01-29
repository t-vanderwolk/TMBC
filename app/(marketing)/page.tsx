import Image from "next/image";
import Link from "next/link";
import homepageHero from "@/assets/images/homepagehero.png";
import editorialNursery from "@/assets/images/editorial-experience-hero-nursery.jpg";
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const eyebrow = "text-[11px] tracking-[0.34em] uppercase text-neutral-500";
const h2 = "mt-4 text-3xl sm:text-4xl leading-tight tracking-tight text-neutral-900 font-playfair";
const lead = "mt-6 text-[16px] sm:text-[18px] leading-relaxed text-neutral-700 max-w-prose";
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

const stepDescriptions: Record<typeof pillarOrder[number], string> = {
  learn:
    "We gently explain what each gear category does so every parent knows why it matters before touching a registry.",
  plan: "Mentors walk beside you in a shared workspace to build a registry that reflects your home, values, and routines.",
  connect: "Small, moderated circles keep conversations rooted in the same season instead of noisy feeds.",
  reflect:
    "A private vault gathers decisions, notes, and photos so this season can be sealed with gratitude and calm.",
};

const stepBackgroundStyles = [
  { backgroundColor: "var(--step-bg-blush)" },
  { backgroundColor: "var(--step-bg-ivory)" },
  { backgroundColor: "var(--step-bg-mauve)" },
  {
    background: "linear-gradient(180deg, var(--step-bg-ivory) 0%, rgba(252,250,246,0) 100%)",
  },
];

const whatWeDont = [
  "We don't sell products.",
  "We don't auto-generate registries.",
  "We don't rush decisions.",
];

const finalMicroBullets = [
  "We review every request before making a match.",
  "Mentor introductions happen by video or DM, never automation.",
  "Support stays private and paced to your schedule.",
];

export default function HomePage() {

  // Home stays the single source of editorial flow: hero → reassurance → journey diagram → pillars → CTA.
  return (
    <main className="min-h-screen bg-[#fef9f6] text-[#1F1C1A]">
      <section
        className="relative w-screen min-h-[460px] sm:min-h-[520px] lg:min-h-[680px] overflow-hidden pt-2 sm:pt-3 lg:pt-4 pb-16 sm:pb-20 lg:pb-24"
        style={{ backgroundColor: "var(--step-bg-blush)" }}
      >
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src={homepageHero}
              alt="Taylor-Made Baby Co. marketing hero"
              fill
              priority
              sizes="100vw"
              className="object-fill object-center"
            />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Mobile breathing room beneath the navbar */}
          <div className="relative max-w-[640px] space-y-6 lg:max-w-[720px] pt-4 sm:pt-8 lg:pt-0">
            {/* Mobile-first padding keeps the CTA within the first screen while larger breakpoints retain ample breathing room. */}
            <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 font-semibold mb-3">
              Calm, personal guidance for expecting parents
            </p>
            {/* Editorial lock: Hero headline must remain calm, Great Vibes script */}
            <div className="hero-editorial font-[400] text-neutral-900">
              <h1 className="text-[48px] lg:text-[64px] leading-[1.15] tracking-[-0.01em] mb-6 sm:text-[52px] max-w-[32ch] lg:max-w-[40ch]">
                <span className="block">Baby prep,</span>
                <span className="block lg:inline lg:whitespace-nowrap">without the</span>
                <span className="block lg:inline lg:whitespace-nowrap"> overwhelm.</span>
              </h1>
            </div>
            <p className="max-w-lg text-[15px] leading-[1.5] text-neutral-600 lg:text-[17px] mt-3 sm:mt-4 lg:mt-7 -ml-1 sm:-ml-2 lg:ml-0 mb-8">
              A calm, mentor-guided way to learn what baby gear actually does, plan what you truly need, and feel
              supported every step of the way.
            </p>
            {/* CTAs stay visible on compact screens */}
            <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 pb-8 sm:pb-10 lg:pb-0">
              <Link
                href="/request-invite"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--tmbc-blush-primary)] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)] sm:w-auto"
              >
                Request an Invite
              </Link>
              <Link
                href="/how-it-works"
                className="hidden sm:inline-flex w-full items-center justify-center rounded-full border !border-[#E7B6C7] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] text-[#3c1c21] transition hover:!border-[#E7B6C7]/80 hover:text-[#3c1c21] sm:w-auto"
              >
                Explore the Experience
              </Link>
              <Link
                href="/how-it-works"
                className="mt-3 text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/80 transition hover:text-[var(--tmbc-charcoal)] sm:hidden"
              >
                Explore the Experience
              </Link>
            </div>
            <div className="space-y-1 text-sm text-neutral-600">
              <p className="italic">No panic scrolling. Just the next calm step.</p>
              <p className="tracking-[0.22em] uppercase text-xs">Invite-only baby planning for modern parents.</p>
            </div>
          </div>
        </div>
      </section>
      <div
        aria-hidden="true"
        className="h-40 w-full blur-[4px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(252,250,246,0) 0%, rgba(252,250,246,0.9) 70%, rgba(252,250,246,1) 100%)",
        }}
      />
      <div className={divider} />
      <section className="py-10 sm:py-12 lg:py-28">
        {/* Mobile spacing keeps the narrative sections comfortably separated without crowding the hero. */}
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 sm:px-6">
          <div className="relative z-10 flex h-full flex-col justify-center space-y-5 lg:space-y-6 text-left mx-auto max-w-[560px] lg:ml-auto">
            <p className="text-[11px] tracking-[0.44em] uppercase text-neutral-500">OUR SERVICE</p>
            <h2 className="font-playfair font-[400] text-[38px] sm:text-[44px] text-neutral-900 leading-[1.2] tracking-[0.02em]">
              Taylor-Made Baby Co. is a private baby-planning service.
            </h2>
          </div>
          <div className="relative flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Image height tracks the text block on compact screens */}
            <div
              className="relative w-full min-h-[500px] sm:min-h-[540px] lg:min-h-[560px] rounded-[32px] overflow-hidden bg-neutral-50 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-transform duration-700 ease-out hover:scale-[1.015]"
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
      {
        // About page intentionally folded into Home for clarity and narrative continuity.
        // This section replaces the standalone About page.
        // Do not extract or split into a separate route.
        (
          <section
            className="py-10 sm:py-12 md:py-28"
            style={{ backgroundColor: "var(--step-bg-ivory)" }}
          >
            {/* Mobile-first padding keeps this philosophy block calm before the next major section. */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-[640px] flex-col items-center text-center space-y-6">
                <p className="text-[11px] tracking-[0.44em] uppercase text-neutral-600">WHY WE EXIST</p>
                <div className="hero-editorial font-[400] text-neutral-900">
                  <h2 className="text-[38px] sm:text-[44px] leading-[1.2] tracking-[0.02em]">
                    Why Taylor-Made Baby Co. exists.
                  </h2>
                </div>
                <p className="text-[16px] sm:text-[18px] leading-[1.8] text-neutral-700">
                  We guide you through each season with calm clarity, mentor-led pacing, and intentional next steps.
                </p>
                <p className="text-[15px] leading-[1.8] text-neutral-500 italic">
                  Because Google at 2 a.m. is not a care plan.
                </p>
              </div>
            </div>
          </section>
        )
      }
      <section className="py-10 sm:py-12 lg:py-12">
        {/* Small mobile padding ensures easy breathing room between narrative blocks. */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-6 text-neutral-600 leading-[1.8]">
            <p className="text-neutral-600 leading-[1.8]">
              Think of it as a personal guide that helps you prepare for life with a baby — without endless Googling, pressure, or guesswork.
            </p>
            <p className="text-neutral-600 leading-[1.8]">
              Taylor-Made Baby Co. is intentionally invite-only. Not to create barriers — but to protect the experience.
            </p>
            <p className="text-neutral-600 leading-[1.8]">
              We work with a limited number of families at a time so that guidance stays thoughtful, personal, and unrushed. Every member is supported by real mentors, real conversations, and real context — not algorithms or volume-based recommendations.
            </p>
            <p className="text-neutral-600 leading-[1.8]">
              Because of that:
            </p>
            <ul className="mt-8 lg:mt-10 space-y-3 text-[14px] leading-[1.9] text-neutral-600">
              {whatWeDont.map((line) => (
                <li key={line} className="flex gap-3 text-[15px] leading-[1.9] text-neutral-700">
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
        </div>
      </section>
      <section aria-labelledby="process" className="mt-32">
        <div className="px-4 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <h2 id="process" className="sr-only">
              Process
            </h2>
            {pillarOrder.map((pillarKey, index) => {
              const pillar = pillarDetails[pillarKey];
              const stepStyle = stepBackgroundStyles[index];
              return (
                <section key={pillarKey} className="rounded-[32px]" style={stepStyle}>
                  <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 sm:px-6 py-20 md:py-24 space-y-6 text-center">
                    <p
                      className="text-[11px] uppercase tracking-[0.4em]"
                      style={{ color: "var(--tmbc-mauveGray)" }}
                    >
                      STEP 0{index + 1}
                    </p>
                    <h3 className="font-playfair font-[400] text-[32px] sm:text-[36px] leading-[1.2] text-neutral-900/90">
                      {pillar.title}
                    </h3>
                    <p className="mx-auto max-w-3xl text-[16px] leading-[1.7] text-neutral-600">
                      {stepDescriptions[pillarKey]}
                    </p>
                    <div className="mt-10 flex justify-center">
                      <div className="w-full max-w-[480px]">
                        <Image
                          src={pillar.image.src}
                          alt={pillar.image.alt}
                          width={480}
                          height={320}
                          sizes="(min-width: 1024px) 480px, 90vw"
                          className="rounded-[32px] object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
      <section
        className="mt-32 pt-16 border-t border-neutral-200"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="mx-auto max-w-5xl">
          <PartnerLogoCarousel />
        </div>
      </section>
      <div className="mt-32 text-center">
        <div className={divider} />
        <section
          className="py-24 md:py-32"
          style={{
            background:
              "radial-gradient(circle at top center, rgba(243,214,223,0.25), transparent 65%)",
          }}
        >
          <div className={container}>
            <div className="space-y-10">
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
          </div>
        </section>
      </div>
    </main>
  );
}

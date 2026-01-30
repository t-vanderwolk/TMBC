import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import homepageHero from "@/assets/images/homepagehero.png";
import editorialNursery from "@/assets/images/editorial-experience-hero-nursery.jpg";
import tmbcSeal from "@/assets/images/tmbc-seal.png";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import { HERO } from "@/app/(marketing)/heroStyles";

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const eyebrow = "text-[11px] tracking-[0.34em] uppercase text-neutral-500";
const h2 = "mt-4 text-3xl sm:text-4xl leading-tight tracking-tight text-neutral-900 font-playfair";
const lead = "mt-6 text-[16px] sm:text-[18px] leading-relaxed text-neutral-700 max-w-prose";
const divider = "my-16 h-px w-full bg-neutral-200/60";

const homepagePillars = [
  {
    title: "Learn",
    description:
      "Gentle, mentor-led orientation so you can understand what really matters before decisions feel urgent.",
  },
  {
    title: "Plan",
    description:
      "Thoughtful registry curation that reflects your home, values, and a pace you control—not a shopping sprint.",
  },
  {
    title: "Connect",
    description:
      "Calm, moderated conversation circles and one-on-one mentor check-ins keep community supportive and quiet.",
  },
  {
    title: "Reflect",
    description:
      "A private vault for journaling and keepsakes that helps you slow down and honor the season you’re living.",
  },
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
      <section className="relative min-h-[520px] md:min-h-[560px] lg:min-h-[640px] overflow-hidden bg-[#FAF7F5]">
        <div className="absolute inset-0">
          <Image
            src={homepageHero}
            alt="Taylor-Made Baby Co. marketing hero"
            fill
            priority
            sizes="100vw"
            className="object-fill object-right"
          />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col gap-6 px-6 py-16 md:px-10 lg:px-16">
          <p className={HERO.eyebrow}>Invitation-only · Mentor-led</p>
          <h1 className={HERO.heading}>
            Baby prep,
            <br />
            without the overwhelm.
          </h1>
          <p className={HERO.body}>
            A calm, guided approach to preparing for baby — without pressure or guesswork.
          </p>
          <div className={HERO.ctaGroup}>
            <Button href="/request-invite" variant="primary">
              Request an Invite
            </Button>
            <Link href="/how-it-works" className={HERO.secondaryLink}>
              Explore how it works →
            </Link>
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
      <section
        className="py-10 sm:py-12 md:py-20"
        style={{ backgroundColor: "var(--step-bg-ivory)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto space-y-6 text-neutral-600" style={{ maxWidth: "65ch" }}>
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
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <p className="text-[11px] tracking-[0.44em] uppercase text-neutral-500">OUR SERVICE</p>
              <h2 className="font-playfair text-[34px] leading-[1.2] text-neutral-900">A personal, mentor-led care rhythm.</h2>
              <p className="text-[16px] leading-[1.7] text-neutral-700">
                Members get one-on-one mentorship, intentional registry planning, a calm community, and a private keepsake
                space so every decision feels supported and aligned with your values.
              </p>
              <div className="space-y-6">
                <div>
                  <p className="text-[13px] uppercase tracking-[0.35em] text-neutral-500 mb-3">What members get</p>
                  <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
                    <li>Mentors who hold pace with your rhythm, keep check-ins gentle, and guide choices without pressure.</li>
                    <li>Registry planning that balances lifestyle, space, values, and the support system you trust.</li>
                    <li>Calm, moderated circles where you can ask questions and hear lived experience, not comparison.</li>
                    <li>A private digital keepsake hub for journaling, photos, and reflections that grow with your season.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[13px] uppercase tracking-[0.35em] text-neutral-500 mb-3">What we don’t do</p>
                  <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
                    <li>Sell products or push trending gear.</li>
                    <li>Rush you toward decisions or timelines that feel uncomfortable.</li>
                    <li>Auto-generate registries or overwhelm you with options.</li>
                    <li>Replace mentorship with algorithms.</li>
                  </ul>
                </div>
              </div>
              <p className="text-[16px] leading-[1.7] text-neutral-700">
                Everything is paced with you in mind so the result is a clearer, more confident start built around your life.
              </p>
            </div>
            <div className="relative h-full w-full rounded-[32px] bg-neutral-50 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
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
      <section className="mt-24 mb-32">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs uppercase tracking-[0.38em] text-neutral-500">
            Learn · Plan · Connect · Reflect
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {homepagePillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[32px] border border-neutral-200/70 bg-white/80 p-6 transition hover:-translate-y-1"
              >
                <h3 className="font-playfair text-2xl leading-[1.2] text-neutral-900">{pillar.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600">{pillar.description}</p>
                <Link
                  href="/experience"
                  className="mt-4 inline-flex text-[11px] uppercase tracking-[0.35em] text-neutral-500 hover:text-neutral-700"
                >
                  Explore →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-32 pt-16 border-t border-neutral-200" style={{ backgroundColor: "transparent" }}>
        <div className="mx-auto max-w-5xl px-6 text-center">
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

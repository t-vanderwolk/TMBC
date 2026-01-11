import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import Image from "next/image";
import ImageFrame from "@/components/marketing/ImageFrame";
import editorialNursery from "../../../assets/images/editorial-experience-hero-nursery.jpg";
import nurseryBunny from "../../../assets/images/nursery-bunny.png";
import nurseryTmbc from "../../../assets/images/nurserytmbc.jpeg";

const problemObservation =
  "We built this after watching earnest questions become quieter than the noise, while isolation grew and performative answers crowded the rest.";

const problemHighlights = [
  "Quiet questions drowned under curated launches.",
  "Isolation deepened as every option demanded performance.",
  "Parenting stories kept asking you to prove you belonged.",
];

const philosophyPoints = [
  {
    title: "Calm over urgency",
    description: "We slow the rhythm so you can settle decisions without racing ahead.",
  },
  {
    title: "Guidance over information",
    description: "Mentors keep context front and center so every answer feels thoughtful.",
  },
  {
    title: "Pacing over pressure",
    description: "You move through the experience at your own pace and return whenever clarity emerges.",
  },
];

const responseProof = [
  "Mentor-led rooms keep conversations grounded in your rhythm, not the latest trends.",
  "Invite-only intake protects the care so mentors answer real questions, not volume.",
  "Steady decisions design around calm choices instead of outcomes or checklists.",
];

const forThisStatements = [
  "You want calm conviction over performative launches.",
  "You value thoughtful pacing and room to pause.",
  "You honor your own rhythm and expect it to be respected.",
];

const notForThisStatements = [
  "You prefer loud urgency or countdown pressure.",
  "You chase the latest trend at the cost of steadiness.",
  "You need pushy sales instead of steady mentorship.",
];

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Why Taylor-Made Baby Co. exists."
        supportingText="We built this after watching honest questions fade beneath the noise, so mentors stay present while you move through this season calmly."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-soft marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        priority
        motion
      />

      <MarketingContent>
        <div className="marketing-content space-y-16 md:space-y-20 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 mt-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The problem we noticed
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              You feel pressure, noise, and isolation — and you should not.
            </h2>
          </div>
          <p className="mt-6 max-w-3xl mx-auto text-sm leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-80">
            {problemObservation}
          </p>
          <ul className="mt-8 max-w-3xl mx-auto space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            {problemHighlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                  •
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
          </section>
          <div className="py-20 my-6 flex justify-center">
            <ImageFrame className="w-full max-w-6xl bg-[var(--tmbc-ivory)]/70 p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="order-2 md:order-1 flex justify-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
                    <Image
                      src={nurseryBunny}
                      alt="Soft plush bunny resting in a curated nursery"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 260px"
                      priority={false}
                    />
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
                    <Image
                      src={editorialNursery}
                      alt="Calm neutral nursery with crib, woven pendant light, and soft natural textures"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 280px"
                      priority={false}
                    />
                  </div>
                </div>
                <div className="order-3 flex justify-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
                    <Image
                      src={nurseryTmbc}
                      alt="Light wood crib in a warm, minimal nursery setting"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 200px"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </ImageFrame>
          </div>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The philosophy
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Calm, guided, paced.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {philosophyPoints.map((point) => (
                <div
                  key={point.title}
                  className="marketing-card bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                    {point.title}
                  </p>
                  <p className="mt-3 leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                How we act on it
              </p>
              <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                This isn’t just language—here’s how it shows up in the rooms and the intake.
              </p>
              <ul className="space-y-2">
                {responseProof.map((line) => (
                  <li key={line} className="pl-4 text-[0.95rem] text-[var(--tmbc-charcoal)] text-opacity-80">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Who this is for (and not for)
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                You choose whether to stay.
              </h2>
            </div>
            <p className="mt-4 max-w-3xl mx-auto text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              TMBC is intentionally boundary-based—this is how we define calm.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="marketing-card bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">For this</p>
                <ul className="mt-4 space-y-3 text-[0.95rem]">
                  {forThisStatements.map((statement) => (
                    <li key={statement} className="leading-relaxed">
                      {statement}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="marketing-card bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">Not for this</p>
                <ul className="mt-4 space-y-3 text-[0.95rem]">
                  {notForThisStatements.map((statement) => (
                    <li key={statement} className="leading-relaxed">
                      {statement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Our commitment
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Quiet conviction, long-term care.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                We show up with thoughtful presence and steady pacing, and you may return whenever you need it.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em] hover:underline hover:underline-offset-4"
              >
                Request quiet access
              </Link>
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-70">
                No urgency. No pressure.
              </p>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}

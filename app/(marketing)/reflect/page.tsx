import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";
import PillarExplanation, { PILLAR_CONTENT } from "@/components/marketing/PillarExplanation";
import Section from "@/components/marketing/Section";

const reflectClarifications = [
  {
    title: "Keepsakes, not performance",
    description:
      "Reflect is about holding moments privately, not ticking off prompts or polishing content for anyone else.",
  },
  {
    title: "Private by default",
    description:
      "There’s no feed, no public archive, and zero pressure to publish — it is yours alone unless you choose otherwise.",
  },
  {
    title: "Slow instead of streaky",
    description:
      "You return when it feels right; the space does not demand consistency or habit-building.",
  },
];

const privateDesign = [
  "No prompts, no reminders, no streaks — you write when silence invites you.",
  "Optional entries mean you can pause, skip, or return without guilt.",
  "Everything stays secure and private unless you explicitly decide to share a page.",
];

const futureValue = [
  "Months from now, these quiet notes become a keepsake that feels like a trusted letter.",
  "It preserves the emotional tone of today without asking you to narrate every detail.",
  "You can revisit and reflect in your own time, letting memories surface gently.",
];

export default function ReflectPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/images/marketing/reflect.jpeg"
        imageAlt="Editorial hero artwork for the Reflect pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="A quiet place you can return to."
        subheading="Reflect is a private keepsake space—no feed, no pressure, just room for what feels important."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        secondaryCta={{
          label: "How It Works (softly)",
          href: "/how-it-works",
        }}
        motion
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <PillarExplanation {...PILLAR_CONTENT.reflect} />
        </div>
      </Section>

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What reflect is (and isn’t)
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                A private keepsake, not a journal checklist.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                It is not about habits, sharing, or productivity; it simply gives you calm room for what feels meaningful today.
              </p>
            </div>
            <div className="mt-10 flex w-full justify-center">
              <ImageFrame className="w-full max-w-[80%] md:max-w-[360px]">
                <MobilePreviewImage
                  src="/assets/images/reflectpreview.png"
                  alt="Taylor-Made Baby Co. reflection journal preview showing keepsakes."
                  width={360}
                  height={720}
                />
              </ImageFrame>
            </div>
            <div className="mt-10 space-y-3 md:hidden">
              {reflectClarifications.map((clarification) => (
                <details
                  key={clarification.title}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {clarification.title}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{clarification.description}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 hidden gap-8 md:grid md:grid-cols-3">
              {reflectClarifications.map((clarification) => (
                <div key={clarification.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {clarification.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    {clarification.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col items-center my-28 space-y-10">
            <p className="max-w-3xl text-center text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              The hands that hold the memories look like this: a keepsake book, a tender stillness, and the space to breathe between entries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[900px] w-full px-6">
              <ImageFrame className="w-full">
                <img
                  src="/assets/images/babybookpic.jpeg"
                  alt="A keepsake baby book and journal capturing early memories"
                  className="w-full rounded-[28px]"
                  loading="lazy"
                />
              </ImageFrame>
              <ImageFrame className="w-full">
                <img
                  src="/assets/images/sleepy-baby.jpeg"
                  alt="A peaceful sleeping baby representing rest and early moments"
                  className="w-full rounded-[28px]"
                  loading="lazy"
                />
              </ImageFrame>
            </div>
          </section>

          <div className="py-24 md:py-32 flex justify-center">
            <ImageFrame className="max-w-[520px]">
              <img
                src="/assets/images/reflection-book.jpeg"
                alt="A softly lit baby journal open for reflection and memory keeping"
                className="w-full rounded-[28px]"
                loading="lazy"
              />
            </ImageFrame>
          </div>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The baby book, reimagined
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Keepsakes that breathe with the season.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70 mx-auto">
                Photos, thoughts, and notes gather over time, quietly layered so the story feels intentional without asking you to document everything.
              </p>
            </div>
            <div className="mt-10 flex justify-center">
              <ImageFrame className="max-w-[520px]">
                <img
                  src="/assets/images/journaling.jpeg"
                  alt="A quiet moment of pregnancy journaling and reflection"
                  className="w-full rounded-[28px]"
                  loading="lazy"
                />
              </ImageFrame>
            </div>
            <div className="mt-10 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-75">
              <p>
                Reflect lets you mark a feeling, a milestone, or a quiet moment without treating it as a performance.
              </p>
              <p>
                The space is soft around you; nothing deletes the pause between entries, and nothing rushes you to the next note.
              </p>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Private by design
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Ownership, discretion, and calm authority.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Your reflections stay optional, non-linear, and yours. No prompts, no reminders, no streaks — just space you
                can enter when you choose.
              </p>
            </div>
            <ul className="mkt-bullet-list">
              {privateDesign.map((item) => (
                <li key={item} className="mkt-bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Why this matters later
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Keepsakes surface in gentle ways.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                When you look back, the quiet entries reveal tone, nuance, and feeling without the pressure to explain
                it all.
              </p>
            </div>
            <ul className="mkt-bullet-list">
              {futureValue.map((item) => (
                <li key={item} className="mkt-bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="py-24 md:py-32 flex justify-center">
            <ImageFrame className="max-w-[420px]">
              <img
                src="/assets/images/sleepy-baby.jpeg"
                alt="A peaceful sleeping baby, conveying calm and quiet presence"
                className="w-full rounded-[28px]"
                loading="lazy"
              />
            </ImageFrame>
          </div>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Closing reassurance
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Reflection sits beside learning and planning.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                This private space threads through the broader journey — it’s a pause between mentor notes and
                planning conversations, always there when you want to come back.
              </p>
              <Link href="/request-invite" className="mkt-btn-primary">
                Request an Invite
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}

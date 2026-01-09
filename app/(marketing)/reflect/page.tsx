import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import MarketingContent from "@/components/marketing/MarketingContent";

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
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Reflect pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="A quiet place you can return to."
        supportingText="Reflect is a private, gentle keepsake practice — no feed, no sharing pressure, just room to capture what feels important when you feel ready."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (softly)",
          href: "/how-it-works",
        }}
      />
      <RibbonDivider />

      <MarketingContent>
        <section className="py-24 md:py-32 flex justify-center">
          <div className="w-full max-w-[90%] md:max-w-[520px] flex justify-center">
            <img
              src="/assets/images/reflectpreview.png"
              alt="Taylor-Made Baby Co. reflection journal preview showing keepsakes."
              className="ui-preview-image w-full h-auto object-contain rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.08)]"
            />
          </div>
        </section>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What reflect is (and isn’t)
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                A private keepsake, not a journaling checklist.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                It is not about habits, sharing, or productivity; it simply gives you a calm space to hold whatever
                feels meaningful today.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
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

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The baby book, reimagined
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Keepsakes that breathe with the season.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Photos, thoughts, and notes gather over time, quietly layered so the story feels intentional without
                asking you to document everything.
              </p>
            </div>
            <div className="mt-10 space-y-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-75">
              <p>
                Reflect lets you mark a feeling, a milestone, or a quiet moment without treating it as a performance.
                It simply keeps those memories with care.
              </p>
              <p>
                The space is soft around you; nothing deletes the pause between entries, and nothing rushes you to the
                next note.
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
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Your reflections stay optional, non-linear, and yours. No prompts, no reminders, no streaks — just space you
                can enter when you choose.
              </p>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {privateDesign.map((item) => (
                <li key={item} className="leading-relaxed">
                  • {item}
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
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                When you look back, the quiet entries reveal tone, nuance, and feeling without the pressure to explain
                it all.
              </p>
            </div>
            <div className="mt-8 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {futureValue.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Closing reassurance
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Reflection sits beside learning and planning.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                This private space threads through the broader journey — it’s a pause between mentor notes and
                planning conversations, always there when you want to come back.
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

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { MarketingHeading } from "@/components/marketing/Typography";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
/**
 * TMBC Transition Rules:
 * - Blush sections may end with a gradient fade into ivory via .section-transition.
 * - Apply the transition only on the final blush block before an ivory section.
 * - Never use transitions under the hero or between ivory bands.
 * - Do not stack multiple transitions back-to-back.
 */
import MarketingHero from "@/components/marketing/MarketingHero";
import evelope from "@/assets/images/evelope.png";
import surveyImage from "@/assets/images/survey.png";
import matchImage from "@/assets/images/match.png";
import welcomeImage from "@/assets/images/welcome.png";
import invitationStill from "@/assets/images/tmbcinvite.png";
import tmbcSeal from "@/assets/images/tmbc-seal.png";
import { SectionBand, textCage, cardBase } from "@/components/marketing/MarketingCadence";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";

const invitationPoints = [
  "Protects the invitation-only nature of the experience.",
  "Keeps every guide and pairing deeply personal.",
  "Limits volume so care stays calm and intentional.",
];

const processSteps = [
  {
    eyebrow: "STEP 01",
    title: "Request an Invite",
    copy:
      "Share where you are in your pregnancy journey; we read every request and reply only when you are ready to begin.",
    image: evelope,
    alt: "A soft ivory envelope with a welcome card and private access code, representing an invitation to Taylor-Made Baby Co.",
  },
  {
    eyebrow: "STEP 02",
    title: "Tell Us About You",
    copy:
      "A calm, handwritten-style intake gathers the lifestyle, space, and preferences that help personalize your mentor pairing.",
    image: surveyImage,
    alt: "Illustration of a thoughtful onboarding questionnaire",
  },
  {
    eyebrow: "STEP 03",
    title: "Get Matched With a Mentor",
    copy:
      "Our team pairs you with a mentor whose experience and rhythm mirror yours so guidance always feels human, not automated.",
    image: matchImage,
    alt: "Illustration representing thoughtful mentor matching",
  },
  {
    eyebrow: "STEP 04",
    title: "Begin Your Guided Journey",
    copy:
      "Lean into the Learn · Plan · Connect · Reflect framework with a guide who keeps pace with every insight and decision you record.",
    image: welcomeImage,
    alt: "Warm invitation still life representing ongoing support and welcome",
  },
];

/**
 * Mobile spacing rule:
 * Marketing sections should breathe on mobile.
 * Prefer py-20+ over dense stacking.
 */

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      <MarketingHero
        eyebrow="How It Works"
        headline="A calm, guided path into Taylor-Made Baby Co."
        lead="A welcoming invite, thoughtful guidance, and steady support—never a rush or a forced decision."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        secondaryCta={{
          label: "See the steps",
          href: "#process",
        }}
        heroImage={HERO_IMAGE_REGISTRY.upperLowerRibbonHero}
      />
      <SectionBand bg="white">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className={`${textCage("standard")} space-y-6`}>
              <MarketingHeading level="h2" className="tracking-[0.02em] text-neutral-900">
                Why we start with an invitation
              </MarketingHeading>
              <p className="text-[16px] leading-[1.7] text-neutral-600">
                Invitations keep the landing space calm while we stay present for the people behind every request.
              </p>
            </div>
            <ul className={`${textCage("standard")} space-y-3 text-[15px] leading-[1.7] text-neutral-700`}>
              {invitationPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--tmbc-blush)]/70" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
                <Image
                  src={invitationStill}
                  alt="Taylor-Made Baby Co. invitation still life representing calm, intentional welcome"
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionBand>

      <SectionBand bg="ivory" id="process">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--tmbc-charcoal)]/10" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/70">THE PROCESS</p>
            <span className="h-px flex-1 bg-[var(--tmbc-charcoal)]/10" aria-hidden="true" />
          </div>
          {processSteps.map((step, index) => {
            const textFirst = index % 2 === 0;
            const stepCopySentences = step.copy.split(/(?<=\.)\s+/);

            return (
              <Fragment key={step.title}>
                <article className={cardBase("space-y-10")}>
                  <div className="grid gap-10 items-center lg:grid-cols-2">
                    <div className={`space-y-6 ${textFirst ? "" : "lg:order-last text-right"}`}>
                      <div className="rounded-[28px] border border-[rgba(62,47,53,0.08)] bg-white/70 p-6">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
                          {step.eyebrow}
                        </p>
                        <MarketingHeading level="h3" className="text-neutral-900/90">
                          {step.title}
                        </MarketingHeading>
                        <div className="space-y-3 text-[15px] leading-[1.7] text-neutral-600">
                          {stepCopySentences.map((sentence, sentenceIndex) => (
                            <p key={`${step.title}-${sentenceIndex}`} className="m-0">
                              {sentence}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={`flex justify-center ${textFirst ? "" : "lg:order-first"}`}>
                      <div className="relative aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-[rgba(62,47,53,0.08)] bg-white">
                        <Image
                          src={step.image}
                          alt={step.alt}
                          fill
                          sizes="(min-width: 1024px) 40vw, 92vw"
                          priority={false}
                          className="h-full w-full rounded-[32px] object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </article>
                {index === 1 && (
                  <div className="lg:hidden mt-6 flex justify-center">
                    {/* Mobile reminder keeps the invite action close after the second step without disrupting desktop rhythm. */}
                    <Link
                      href="/request-invite"
                      className="flex items-center rounded-full border border-[var(--tmbc-mauve)] px-5 py-2 text-[12px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]/70 hover:text-[var(--tmbc-charcoal)]"
                    >
                      Request an Invite
                    </Link>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </SectionBand>

      <SectionBand bg="blush">
        <div className={`${textCage("intro")} text-center`}>
          <Image
            src={tmbcSeal}
            alt="Baby Approved — Taylor-Made Baby Co."
            width={160}
            height={160}
            className="mx-auto opacity-90 w-auto h-auto"
            priority={false}
            unoptimized
          />
          <p className="mt-6 text-sm tracking-wide text-muted-foreground">
            Every recommendation inside Taylor-Made Baby Co. is reviewed for safety, practicality, and real-life use.
          </p>
          <p className="mt-2 text-sm italic text-muted-foreground">
            Calm guidance. Thoughtful standards. Always baby-first.
          </p>
        </div>
      </SectionBand>

      <SectionBand bg="white">
        <div className={`${textCage("intro")} text-center space-y-8`}>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">CALM START</p>
          <MarketingHeading level="h2" className="text-[var(--tmbc-charcoal)]">
            Guidance that stays present with you, whatever this season looks like.
          </MarketingHeading>
          <p className="text-[15px] leading-[1.7] text-[var(--tmbc-charcoal)]/80">
            Request an invite when the time feels right; we’ll stay ready with thoughtful mentors and steady next steps.
          </p>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/request-invite"
              className="inline-flex items-center justify-center rounded-full bg-[var(--tmbc-blush-primary)] px-6 py-3 text-[14px] font-semibold tracking-[0.35em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)] shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
            >
              Request an Invite
            </Link>
            <Link
              href="/request-invite"
              className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/80 transition hover:underline underline-offset-4"
            >
              Already have a code?
            </Link>
          </div>
        </div>
      </SectionBand>
    </>
  );
}

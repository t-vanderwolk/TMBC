import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import howItWorksHero from "@/assets/images/howitworkshero.png";
import evelope from "@/assets/images/evelope.png";
import surveyImage from "@/assets/images/survey.png";
import matchImage from "@/assets/images/match.png";
import welcomeImage from "@/assets/images/welcome.png";
import invitationStill from "@/assets/images/tmbcinvite.png";
import tmbcSeal from "@/assets/images/tmbc-seal.png";

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

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative w-screen min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] overflow-hidden pt-2 sm:pt-3 lg:pt-4 pb-16 sm:pb-20 lg:pb-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 block sm:hidden">
            <Image
              src={howItWorksHero}
              alt="Taylor-Made Baby Co. hero art"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 100vw"
              className="object-cover object-right"
            />
          </div>
          <div className="absolute inset-0 hidden sm:block">
            <Image
              src={howItWorksHero}
              alt="Taylor-Made Baby Co. hero art"
              fill
              priority
              sizes="100vw"
              className="object-fill object-right lg:object-[80%_50%]"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-[var(--tmbc-blush)]/40 via-[var(--tmbc-ivory)]/40 to-transparent"
            aria-hidden
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative max-w-[640px] space-y-8 pt-6 sm:pt-8 lg:pt-0 text-center lg:text-left">
            <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 font-semibold">
              HOW IT WORKS
            </p>
            <div className="hero-editorial font-playfair font-[400] text-neutral-900">
              <h1 className="text-[48px] lg:text-[64px] leading-[1.15] tracking-[-0.01em] mb-6 sm:mb-6 lg:mb-6 max-w-[24ch] mx-auto lg:mx-0">
                A calm, guided path into Taylor-Made Baby Co.
              </h1>
            </div>
            <p className="max-w-lg text-[15px] leading-[1.7] text-neutral-500 lg:text-[17px] mx-auto lg:mx-0 mb-8">
              A welcoming invite, thoughtful guidance, and steady support—never a rush or a forced decision.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 justify-center lg:justify-start">
              <Link
                href="/request-invite"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--tmbc-blush-primary)] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)] sm:w-auto"
              >
                Request an Invite
              </Link>
            </div>
            <div className="text-sm">
              <Link
                href="/experience"
                className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/80 transition hover:text-[var(--tmbc-charcoal)]"
              >
                See the steps →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div
        aria-hidden="true"
        className="h-40 w-full blur-[4px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(252,250,246,0) 0%, rgba(252,250,246,0.85) 65%, rgba(252,250,246,1) 100%)",
        }}
      />

      <section className="bg-transparent">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="tmbc-divider-ribbon mb-10" aria-hidden />
          <div className="mb-10 flex justify-center" aria-hidden="true">
            <div
              className="h-px w-32"
              style={{
                background:
                  "linear-gradient(90deg, rgba(243,214,223,0) 0%, rgba(243,214,223,0.8) 50%, rgba(243,214,223,0) 100%)",
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h2 className="font-playfair text-[36px] leading-[1.2] tracking-[0.02em] text-neutral-900">
                Why we start with an invitation
              </h2>
              <p className="text-[16px] leading-[1.7] text-neutral-600 max-w-2xl">
                Invitations keep the landing space calm while we stay present for the people behind every request.
              </p>
              <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-700 relative">
                {invitationPoints.map((point) => (
                  <li key={point} className="flex gap-3 marker:text-[var(--tmbc-blush-text)]">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[rgba(243,214,223,0.9)]" />
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
                    className="object-cover"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="my-16 flex justify-center" aria-hidden="true">
            <div
              className="h-px w-48"
              style={{
                background:
                  "linear-gradient(90deg, rgba(243,214,223,0) 0%, rgba(243,214,223,0.8) 50%, rgba(243,214,223,0) 100%)",
              }}
            />
          </div>
        </div>
      </section>

      <section className="tmbc-bridge-cool">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="tmbc-divider-ribbon mb-10" aria-hidden />
          <div className="space-y-20">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-[rgba(243,214,223,0.5)]" />
              <p className="text-[11px] uppercase tracking-[0.5em]" style={{ color: "var(--tmbc-mauveGray)" }}>
                THE PROCESS
              </p>
              <span className="h-px flex-1 bg-[rgba(243,214,223,0.5)]" />
            </div>
            {processSteps.map((step, index) => {
              const stepStyle =
                index === 0
                  ? { backgroundColor: "var(--step-bg-blush)" }
                  : index === 1
                  ? { backgroundColor: "var(--step-bg-ivory)" }
                  : index === 2
                  ? { backgroundColor: "var(--step-bg-mauve)" }
                  : {
                      background:
                        "linear-gradient(180deg, var(--step-bg-ivory) 0%, rgba(252,250,246,0) 100%)",
                    };

              return (
                <Fragment key={step.title}>
                  <section
                    className="step py-16 md:py-24 rounded-[32px]"
                    style={stepStyle}
                  >
                    <div className="space-y-12">
                      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div className={`space-y-4 ${index % 2 ? "lg:order-last lg:text-right" : ""}`}>
                          <div className="tmbc-ivory-card rounded-[32px] p-6 md:p-8">
                            <p
                              className="text-[11px] uppercase tracking-[0.4em] relative"
                              style={{ color: "var(--tmbc-mauveGray)" }}
                            >
                              <span
                                aria-hidden="true"
                                className="absolute -left-6 top-1/2 h-px w-4 -translate-y-1/2"
                                style={{ backgroundColor: "var(--tmbc-blush-line)" }}
                              />
                              {step.eyebrow}
                            </p>
                            <h3 className="font-playfair font-[400] text-[32px] leading-[1.2] text-neutral-900/90">
                              {step.title}
                            </h3>
                            <p className="text-[15px] leading-[1.7] text-neutral-600">{step.copy}</p>
                          </div>
                        </div>
                        <div className={`${index % 2 ? "lg:order-first" : ""}`}>
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px]">
                            <Image
                              src={step.image}
                              alt={step.alt}
                              fill
                              sizes="(min-width: 1024px) 40vw, 92vw"
                              priority={false}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </Fragment>
              );
            })}
          </div>
        </div>
      </section>

<section className="py-20 sm:py-24 mt-16 sm:mt-20 mb-16 sm:mb-20">
  <div className="mx-auto max-w-xl text-center">
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
      </section>

      <section
        className="py-20 sm:py-24 mt-12 sm:mt-16"
        style={{
          background:
            "radial-gradient(circle at top center, rgba(243,214,223,0.25), transparent 65%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-500">CALM START</p>
          <h2 className="font-playfair text-[36px] leading-[1.2] text-neutral-900">
            Guidance that stays present with you, whatever this season looks like.
          </h2>
          <p className="text-[15px] leading-[1.7] text-neutral-600">
            Request an invite when the time feels right; we’ll stay ready with thoughtful mentors and steady next steps.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/request-invite"
              className="inline-flex items-center justify-center rounded-full bg-[var(--tmbc-blush-primary)] px-6 py-3 text-[14px] font-semibold tracking-[0.35em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)] shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
            >
              Request an Invite
            </Link>
            <Link
              href="/request-invite"
              className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/80 transition hover:text-[var(--tmbc-charcoal)]"
            >
              Already have a code?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

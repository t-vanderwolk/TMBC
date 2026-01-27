import Image from "next/image";
import Link from "next/link";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import howItWorksHero from "@/assets/images/howitworkshero.png";
import editorialNursery from "@/assets/images/tmbcinvite.png";
import connectpreview from "@/assets/images/connectpreview.png";
import matchImage from "@/assets/images/match.png";
import surveyImage from "@/assets/images/survey.png";
import welcomeImage from "@/assets/images/welcome.png";
import evelope from "@/assets/images/evelope.png";

const invitationBullets = [
  "Protecting the intimate, invite-only experience for every family.",
  "Keeping mentor availability intact so pacing never feels rushed.",
  "Ensuring guidance stays thoughtful, human, and deeply personal.",
];

const flowSteps = [
  {
    eyebrow: "STEP 01",
    title: "Request an invite",
    copy: "Share where you are and we respond with a calm match—but only when you are ready.",
    image: evelope,
    alt: "A soft ivory envelope with a welcome card and private access code, representing an invitation to Taylor-Made Baby Co.",
  },
  {
    eyebrow: "STEP 02",
    title: "Tell Us About You",
    copy: "A short, reassuring explanation that this step gathers thoughtful context to personalize mentorship and recommendations.",
    image: surveyImage,
    alt: "Illustration of a thoughtful onboarding questionnaire",
  },
  {
    eyebrow: "STEP 03",
    title: "Get Matched With a Mentor",
    copy: "Each family is thoughtfully paired with a mentor whose experience, lifestyle alignment, and expertise best support their needs.",
    image: matchImage,
    alt: "Illustration representing thoughtful mentor matching",
  },
  {
    eyebrow: "STEP 04",
    title: "Ongoing support",
    copy: "Check-ins stay gentle, paced around your questions and countertop moments.",
    image: welcomeImage,
    alt: "Warm invitation still life representing ongoing support and welcome",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative w-screen min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] overflow-hidden pt-2 sm:pt-3 lg:pt-4 pb-16 sm:pb-20 lg:pb-24">
        {/* Homepage hero parity—text, gradient, and CTA rhythm match the main hero treatment. */}
        <div className="absolute inset-0">
          <Image
            src={howItWorksHero}
            alt="Taylor-Made Baby Co. hero art"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[var(--tmbc-blush)]/40 via-[var(--tmbc-ivory)]/40 to-transparent"
            aria-hidden
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative max-w-[640px] space-y-6 pt-6 sm:pt-8 lg:pt-0">
            <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 font-semibold mb-3">
              HOW IT WORKS
            </p>
            <div className="hero-editorial font-playfair font-[400] text-neutral-900">
              <h1 className="text-[48px] lg:text-[64px] leading-[1.15] tracking-[-0.01em] mb-4 sm:mb-5 lg:mb-6 max-w-[24ch]">
                A calm, guided path into Taylor-Made Baby Co.
              </h1>
            </div>
            <p className="max-w-lg text-[15px] leading-[1.5] text-neutral-600 lg:text-[17px]">
              We work with a limited number of families so every step feels personal, unhurried, and thoughtfully
              supported.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 pb-8 sm:pb-10 lg:pb-0">
              <Link
                href="/request-invite"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--tmbc-blush-primary)] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)] sm:w-auto"
              >
                Request an Invite
              </Link>
            </div>
            <div>
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

      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-6">
        <span className="h-px flex-1 bg-neutral-300" />
        <p className="text-[11px] uppercase tracking-[0.5em] text-neutral-500">THE PROCESS</p>
        <span className="h-px flex-1 bg-neutral-300" />
      </div>

      <MarketingContent>
        <div className="space-y-16 px-4 sm:px-6">
          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <h2 className="font-playfair text-[36px] leading-[1.2] tracking-[0.02em] text-neutral-900">
                Why We Start With an Invitation
              </h2>
              <p className="text-[16px] leading-[1.7] text-neutral-600">
                Invitations keep the experience intimate so we can keep focusing on the humans behind the questions.
              </p>
              <ul className="space-y-3 text-[15px] leading-[1.7] text-neutral-700">
                {invitationBullets.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-neutral-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/request-invite"
                className="inline-flex rounded-full bg-[var(--tmbc-blush-primary)] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)]"
              >
                Request an Invite
              </Link>
            </div>
            <div className="flex justify-center">
              <ImageFrame className="w-full max-w-[520px] bg-transparent relative">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={editorialNursery}
                    alt="Taylor-Made Baby Co. invitation still life representing calm, intentional welcome"
                    fill
                    sizes="(min-width: 1024px) 44vw, 90vw"
                    priority={false}
                    className="h-full w-full object-cover"
                  />
                </div>
              </ImageFrame>
            </div>
          </section>

          <section className="space-y-12">
            {flowSteps.map((step, index) => (
              <div key={step.title} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className={`space-y-4 ${index % 2 ? "lg:order-last" : ""}`}>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-500">{step.eyebrow}</p>
                  <h3 className="font-playfair text-[32px] leading-[1.2] text-neutral-900">{step.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-neutral-600">{step.copy}</p>
                </div>
                <div className={index % 2 ? "lg:order-first" : ""}>
                  <ImageFrame className="w-full bg-transparent relative">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 92vw"
                        priority={false}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </ImageFrame>
                </div>
              </div>
            ))}
          </section>

          <section className="text-center space-y-6">
            <p className="text-[15px] leading-[1.7] text-neutral-600">
              No rush. No pressure. Just steady guidance that meets you where you are.
            </p>
            <Link
              href="/request-invite"
              className="inline-flex rounded-full bg-[var(--tmbc-blush-primary)] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)]"
            >
              Request an Invite
            </Link>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}

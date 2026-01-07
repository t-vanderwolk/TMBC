"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import academyPreview from "../../assets/images/academypreview.png";
import planPreview from "../../assets/images/planpreview.png";
import connectPreview from "../../assets/images/connectpreview.png";
import reflectPreview from "../../assets/images/reflectpreview.png";

interface FeatureBlock {
  label: string;
  headline: string;
  body: string;
  image: StaticImageData;
  alt: string;
}

const aboutPhilosophy = [
  {
    title: "Invite-only by design",
    description:
      "A smaller, more attentive community lets mentors stay present and personal.",
  },
  {
    title: "Mentor-first planning",
    description:
      "Human guidance keeps decisions grounded in your life, not a generic list.",
  },
  {
    title: "Fewer decisions, better ones",
    description:
      "We slow the pace so you can choose what fits and skip what does not.",
  },
];

const aboutNot = [
  {
    title: "Not a registry",
    description: "We do not push products or fill lists on your behalf.",
  },
  {
    title: "Not a marketplace",
    description: "There is no shopping feed or urgency to buy.",
  },
  {
    title: "Not social media",
    description: "No algorithms, no performance, just focused support.",
  },
];

const featureBlocks: FeatureBlock[] = [
  {
    label: "Learn",
    headline: "Education that feels gentle and useful.",
    body: "Clear, practical guidance on baby gear, safety, routines, and real-life decisions - without the pressure to master everything at once. (Nobody does.)",
    image: academyPreview,
    alt: "Academy preview screen showing calm lessons.",
  },
  {
    label: "Plan",
    headline: "Decision support without the pressure.",
    body: "From registries to real-life logistics, your mentor helps you plan step by step - we will hold the map, you set the pace.",
    image: planPreview,
    alt: "Planning workspace preview with mentor notes.",
  },
  {
    label: "Connect",
    headline: "Structured community, not social media.",
    body: "A supportive circle of parents, mentors, and professionals navigating pregnancy and early parenthood together - honestly, kindly, and without comparison.",
    image: connectPreview,
    alt: "Community dashboard preview.",
  },
  {
    label: "Reflect",
    headline: "Keepsakes with an heirloom feel.",
    body: "Capture thoughts, moments, and memories privately, gently, and shared only if you choose. (Some seasons are meant to be held, not optimized.)",
    image: reflectPreview,
    alt: "Reflective journal preview.",
  },
];

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  useEffect(() => {
    const code = searchParams.get("invite");
    if (code) {
      setInviteCode(code.trim().toUpperCase());
    }
    if (searchParams.get("invite_error")) {
      setInviteError("Invite code missing or invalid. Please enter your approved invite code.");
    }
  }, [searchParams]);

  const handleInviteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = inviteCode.trim().toUpperCase();
    if (!normalized) {
      setInviteError("Please enter your invite code.");
      return;
    }

    setInviteSubmitting(true);
    setInviteError("");

    try {
      const response = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalized }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setInviteError(payload?.error || "Invalid or already used invite code.");
        return;
      }

      router.push("/onboarding/start");
    } catch {
      setInviteError("Unable to validate invite code.");
    } finally {
      setInviteSubmitting(false);
    }
  };

  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. marketing hero"
        imageWidth={1536}
        imageHeight={1024}
        headline="A new way to prep for baby - and parenthood."
        supportingText="Think less spiraling, more steady steps. We help you learn, plan, connect, and reflect - with a real human mentor who's been there (and won't judge your 2 a.m. questions)."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How it works (without the overwhelm)",
          href: "/how-it-works",
        }}
        priority
      />
      <RibbonDivider />

      <MarketingContent>
        <div className="marketing-content space-y-20 md:space-y-24 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 text-center">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
                Invite-only · Mentor-guided · Calm digital planning
              </p>
              <span className="text-[0.65rem] text-[var(--tmbc-charcoal)] text-opacity-50">
                Takes about 60 seconds · No commitment
              </span>
              <div className="space-y-3 text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
                <p>We'll start where you are. The rest can wait.</p>
                <p className="system-language pt-2">
                  Learn → Plan → Connect → Reflect
                </p>
              </div>
              <div className="w-full space-y-3 pt-2">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">
                  Already have an invite?
                </p>
                <form
                  className="mt-6 flex w-full flex-col gap-3 md:flex-row md:items-end"
                  onSubmit={handleInviteSubmit}
                >
                  <input
                    value={inviteCode}
                    onChange={(event) => {
                      setInviteCode(event.target.value);
                      if (inviteError) setInviteError("");
                    }}
                    placeholder="Enter your invite code"
                    className="w-full h-14 rounded-full border border-[var(--tmbc-mauve)]/40 bg-white px-4 text-base text-[var(--tmbc-charcoal)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--tmbc-mauve)]/40"
                  />
                  <button
                    type="submit"
                    className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em] w-full md:w-auto"
                    disabled={inviteSubmitting}
                  >
                    {inviteSubmitting ? "Checking..." : "Continue"}
                  </button>
                </form>
                {inviteError && (
                  <p className="text-xs text-red-600">{inviteError}</p>
                )}
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8">
            <div className="space-y-24">
              {featureBlocks.map((block) => (
                <article
                  key={block.label}
                  className="max-w-[90%] md:max-w-[640px] mx-auto space-y-6"
                >
                  <div className="space-y-6">
                    <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                      {block.label}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl">{block.headline}</h3>
                    <p className="text-base leading-[1.8] md:leading-[1.7] text-[var(--tmbc-charcoal)] text-opacity-80">
                      {block.body}
                    </p>
                  </div>
                  <div className="max-w-[85%] md:max-w-[520px] mx-auto mt-16 mb-24">
                    <Image
                      src={block.image}
                      alt={block.alt}
                      className="w-full h-auto object-contain"
                      sizes="(min-width: 768px) 520px, 90vw"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <PartnerLogoCarousel />

          <RibbonDivider />

          <section className="marketing-section marketing-card space-y-8 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/50 px-8">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Why it feels loud
            </p>
            <div className="space-y-6 leading-[1.8] text-base text-[var(--tmbc-charcoal)] text-opacity-80">
              <p>
                Most parents don't feel confused because they're unprepared. They feel confused because everything feels urgent - all at once.
              </p>
              <p>
                Registries, checklists, and social feeds make it louder. We make it quieter.
              </p>
              <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
                You're not behind. You're just hearing too many voices.
              </p>
              <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
                So we built something quieter.
              </p>
            </div>
          </section>

          <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What makes this different
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Grounded guidance, not generic advice.
              </h2>
            </div>
            <div className="space-y-8 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  Human-led, not algorithm-led
                </p>
                <p className="mt-2">
                  You work with a real mentor who understands your life, your space, and your priorities - not a preset list.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  Sequence over urgency
                </p>
                <p className="mt-2">
                  We guide decisions in the right order - so nothing feels rushed or forgotten (or panic-Googled at 2am).
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  Advocacy, not sales
                </p>
                <p className="mt-2">
                  We don't push products. We help you choose what's right for you, and what can wait.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  From planning to support
                </p>
                <p className="mt-2">
                  We stay with you - through learning, planning, connection, and reflection (and the questions that show up later).
                </p>
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                About TMBC
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Calm preparation over consumption.
              </h2>
            </div>
            <p className="max-w-[680px] text-base text-[var(--tmbc-charcoal)] text-opacity-75">
              Mentor-led guidance that respects your pace and priorities, so baby prep feels steady instead of urgent.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {aboutPhilosophy.map((item) => (
                <div key={item.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {item.title}
                  </p>
                  <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card space-y-6 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What this is not
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                A quieter, more human alternative.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {aboutNot.map((item) => (
                <div key={item.title} className="marketing-card bg-white/80 p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {item.title}
                  </p>
                  <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/80 px-10 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Member to mentor
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Our mentors were once members themselves.
            </h2>
            <p className="mx-auto mt-4 max-w-[680px] text-base text-[var(--tmbc-charcoal)] text-opacity-75">
              They've planned, prepared, and learned inside this system - and now guide others with empathy, clarity,
              and lived experience (the kind that can't be faked).
            </p>
            <p className="mt-6 system-language">
              This is not coaching. This is guided preparation.
            </p>
          </section>

          <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What this gives you
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                A calm, steady experience.
              </h2>
            </div>
            <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              A calmer way to move forward - without pressure or panic decisions.
            </p>
            <ul className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
              <li>• A dedicated mentor</li>
              <li>• Guided learning &amp; planning flow</li>
              <li>• Registry support without pressure</li>
              <li>• Ongoing access as questions evolve</li>
              <li>• A calm, private space - no feeds, no noise (no doomscrolling, promise)</li>
            </ul>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Affiliate partnerships exist, but guidance always comes first.
            </p>
          </section>

          <section className="marketing-section marketing-card grid gap-8 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 md:grid-cols-2">
            <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70 md:col-span-2">
              There's no right or wrong way to prepare - just what feels supportive to you.
            </p>
            <div className="marketing-card space-y-4 bg-white/80 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                This is for you if...
              </p>
              <ul className="space-y-2 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
                <li>• You want clarity, not chaos</li>
                <li>• You value guidance over opinions</li>
                <li>• You prefer thoughtful decisions</li>
              </ul>
            </div>
            <div className="marketing-card space-y-4 bg-white/80 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                This may not be for you if...
              </p>
              <ul className="space-y-2 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
                <li>• You want flash sales and trend lists</li>
                <li>• You're looking for a quick checklist only</li>
              </ul>
            </div>
          </section>

          <footer className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/80 px-10 pt-20 pb-20 md:py-32 space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Invite-only
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Taylor-Made Baby Co. is invite-only so we can keep guidance personal and intentional.
            </h2>
            <p className="mx-auto max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              We keep it small so the care stays real.
            </p>
            <p className="mx-auto max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              You don't need to feel ready to request an invite.
            </p>
            <Link
              href="/request-invite"
              className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em] mt-10"
            >
              Request an Invite
            </Link>
          </footer>
        </div>
      </MarketingContent>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-[20vh]" />}>
      <HomePageContent />
    </Suspense>
  );
}

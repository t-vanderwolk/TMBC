"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ContainedFullWidthHero from "@/components/marketing/ContainedFullWidthHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import AppJourneySection from "@/components/marketing/AppJourneySection";

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
      <ContainedFullWidthHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. marketing hero"
        priority
      >
        <div className="hero-copy md:contents">
          <h1 className="hero-headline">
            A calmer way to prep for baby — and parenthood.
          </h1>
          <p className="hero-supporting mt-6">
            Think less spiraling, more steady steps. We help you learn, plan,
            connect, and reflect — with a real human mentor who’s been there
            (and won’t judge your 2 a.m. questions).
          </p>
        </div>
        <div className="hero-cta mt-10 hidden flex-col gap-4 justify-center md:flex md:flex-row">
          <Link
            href="/request-invite"
            className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
          >
            Request an Invite
          </Link>
          <Link
            href="/how-it-works"
            className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
          >
            How it works (without the overwhelm)
          </Link>
        </div>
      </ContainedFullWidthHero>

      <div className="hero-cta mt-10 flex flex-col gap-4 justify-center px-6 md:hidden">
        <Link
          href="/request-invite"
          className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
        >
          Request an Invite
        </Link>
        <Link
          href="/how-it-works"
          className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
        >
          How it works (without the overwhelm)
        </Link>
      </div>

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
        <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Invite-only · Mentor-guided · Calm digital planning
          </p>
          <span className="text-[0.65rem] text-[var(--tmbc-charcoal)] text-opacity-50">
            Takes about 60 seconds · No commitment
          </span>
          <div className="space-y-3 text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
            <p>We’ll start where you are. The rest can wait.</p>
            <p className="system-language pt-2">
              Learn → Plan → Connect → Reflect
            </p>
          </div>
          <div className="w-full space-y-3 pt-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">
              Already have an invite?
            </p>
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleInviteSubmit}>
              <input
                value={inviteCode}
                onChange={(event) => {
                  setInviteCode(event.target.value);
                  if (inviteError) setInviteError("");
                }}
                placeholder="Enter your invite code"
                className="w-full min-h-[56px] rounded-full border border-[var(--tmbc-mauve)]/40 bg-white px-4 py-4 text-base text-[var(--tmbc-charcoal)] shadow-sm"
              />
              <button
                type="submit"
                className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em] disabled:opacity-70"
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

      <AppJourneySection />

      <RibbonDivider />

      <PartnerLogoCarousel />

      <section className="marketing-section marketing-card space-y-5 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/50 px-8 py-20 md:py-32">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Why it feels loud</p>
        <div className="max-w-[680px] space-y-6 text-base text-[var(--tmbc-charcoal)] text-opacity-80">
          <p>
            Most parents don&apos;t feel confused because they&apos;re unprepared.
            They feel confused because everything feels urgent — all at once.
          </p>
          <p>Registries, checklists, and social feeds make it louder. We make it quieter.</p>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
            You’re not behind. You’re just hearing too many voices.
          </p>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">So we built something quieter.</p>
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
              You work with a real mentor who understands your life, your space, and your priorities — not a preset list.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Sequence over urgency
            </p>
            <p className="mt-2">
              We guide decisions in the right order — so nothing feels rushed or forgotten (or panic-Googled at 2am).
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Advocacy, not sales
            </p>
            <p className="mt-2">
              We don&apos;t push products. We help you choose what&apos;s right for you, and what can wait.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              From planning to support
            </p>
            <p className="mt-2">
              We stay with you — through learning, planning, connection, and reflection (and the questions that show up later).
            </p>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-card relative space-y-6 overflow-hidden bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32">
        <div className="space-y-2">
          <p className="system-language">
            Learn · Plan · Connect · Reflect
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A clear rhythm for each step.
          </h2>
        </div>
        <div className="space-y-6 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
          <div className="marketing-card flex flex-col gap-4 bg-white/80 p-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Learn</p>
              <p>Understand what matters next.</p>
            </div>
          </div>
          <div className="marketing-card flex flex-col gap-4 bg-white/80 p-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Plan</p>
              <p>Make decisions in the right order.</p>
            </div>
          </div>
          <div className="marketing-card flex flex-col gap-4 bg-white/80 p-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Connect</p>
              <p>Ask questions when they come up.</p>
            </div>
          </div>
          <div className="marketing-card flex flex-col gap-4 bg-white/80 p-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Reflect</p>
              <p>Capture the moments you’ll want to remember.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/80 px-10 py-20 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Member to mentor
        </p>
        <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
          Our mentors were once members themselves.
        </h2>
        <p className="mx-auto mt-4 max-w-[680px] text-base text-[var(--tmbc-charcoal)] text-opacity-75">
          They&apos;ve planned, prepared, and learned inside this system — and now guide others with empathy, clarity,
          and lived experience (the kind that can&apos;t be faked).
        </p>
        <p className="mt-6 system-language">
          This is not coaching. This is guided preparation.
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this gives you
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A calm, steady experience.
          </h2>
        </div>
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          A calmer way to move forward — without pressure or panic decisions.
        </p>
        <ul className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
          <li>• A dedicated mentor</li>
          <li>• Guided learning &amp; planning flow</li>
          <li>• Registry support without pressure</li>
          <li>• Ongoing access as questions evolve</li>
          <li>• A calm, private space — no feeds, no noise (no doomscrolling, promise)</li>
        </ul>
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Affiliate partnerships exist, but guidance always comes first.
        </p>
      </section>

      <section className="marketing-section marketing-card grid gap-8 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32 md:grid-cols-2">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70 md:col-span-2">
          There’s no right or wrong way to prepare — just what feels supportive to you.
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
            <li>• You&apos;re looking for a quick checklist only</li>
          </ul>
        </div>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-[var(--tmbc-ivory)]/80 px-10 py-20 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Invite-only</p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
          Taylor-Made Baby Co. is invite-only so we can keep guidance personal and intentional.
        </h2>
        <p className="mx-auto max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          We keep it small so the care stays real.
        </p>
        <p className="mx-auto max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          You don’t need to feel ready to request an invite.
        </p>
        <Link
          href="/request-invite"
          className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
        >
          Request an Invite
        </Link>
      </section>
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

"use client";

import Image from "next/image";
import Link from "next/link";

import heroPreview from "../../assets/images/ui-learn-hero-classes-preview.png";
import heroDetailPreview from "../../assets/images/IMG_9982.jpeg";

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 text-[var(--tmbc-charcoal)]">
      <section className="grid gap-10 rounded-[56px] border border-[var(--tmbc-mauve)]/40 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.35)] marketing-section md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Invite-only, mentor-led baby planning — guided by a real human
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[var(--tmbc-charcoal)] sm:text-5xl">
            A calmer way to prepare for life with a baby.
          </h1>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
            Paired with a real mentor who helps you learn, plan, and prepare — step by step.
          </p>
          <p className="max-w-xl text-lg text-[var(--tmbc-charcoal)] text-opacity-80">
            Taylor-Made Baby Co. pairs you with a trusted mentor to help you plan, choose, and prepare — thoughtfully,
            in the right order, without pressure. (You don’t need to know everything yet.)
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex flex-col gap-2">
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
              >
                Request an Invite
              </Link>
              <span className="text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
                Takes about 60 seconds · No commitment
              </span>
            </div>
            <Link
              href="/how-it-works"
              className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70"
            >
              How it works (in plain language)
            </Link>
          </div>
          <div className="space-y-2 text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
            <p>We’ll start where you are. The rest can wait.</p>
            <p className="uppercase tracking-[0.45em]">Learn → Plan → Connect → Reflect</p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="relative w-full overflow-hidden rounded-[36px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/70 aspect-[4/5] md:aspect-[3/4]">
            <Image
              src={heroPreview}
              alt="Guided learning and planning preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          </div>
          <div className="relative w-full overflow-hidden rounded-[28px] border border-[var(--tmbc-mauve)]/15 bg-[var(--tmbc-ivory)]/70 aspect-[4/3]">
            <Image
              src={heroDetailPreview}
              alt="Newborn details in soft light"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/50 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.22)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Why it feels loud</p>
        <div className="space-y-3 text-base text-[var(--tmbc-charcoal)] text-opacity-80">
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

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What makes this different
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Grounded guidance, not generic advice.
          </h2>
        </div>
        <div className="space-y-5 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Human-led, not algorithm-led
            </p>
            <p className="mt-2">
              You work with a real mentor who understands your life, your space, and your priorities — not a preset list.
            </p>
          </div>
          <div className="h-px w-full bg-[var(--tmbc-mauve)]/20" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Sequence over urgency
            </p>
            <p className="mt-2">
              We guide decisions in the right order — so nothing feels rushed or forgotten (or panic-Googled at 2am).
            </p>
          </div>
          <div className="h-px w-full bg-[var(--tmbc-mauve)]/20" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Advocacy, not sales
            </p>
            <p className="mt-2">
              We don&apos;t push products. We help you choose what&apos;s right for you, and what can wait.
            </p>
          </div>
          <div className="h-px w-full bg-[var(--tmbc-mauve)]/20" />
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

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Learn · Plan · Connect · Reflect
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A clear rhythm for each step.
          </h2>
        </div>
        <div className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
          <div className="flex flex-col gap-2 rounded-[24px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Learn</p>
            <p>Understand what matters next.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-[24px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Plan</p>
            <p>Make decisions in the right order.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-[24px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Connect</p>
            <p>Ask questions when they come up.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-[24px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Reflect</p>
            <p>Capture the moments you’ll want to remember.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/80 p-10 text-center shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Member to mentor
        </p>
        <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
          Our mentors were once members themselves.
        </h2>
        <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
          They&apos;ve planned, prepared, and learned inside this system — and now guide others with empathy, clarity,
          and lived experience (the kind that can&apos;t be faked).
        </p>
        <p className="mt-4 text-sm uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
          This is not coaching. This is guided preparation.
        </p>
      </section>

      <section className="space-y-5 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this gives you
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A calm, steady experience.
          </h2>
        </div>
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          A calmer way to move forward — without pressure or panic decisions.
        </p>
        <ul className="space-y-3 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
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

      <section className="grid gap-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-2">
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70 md:col-span-2">
          There’s no right or wrong way to prepare — just what feels supportive to you.
        </p>
        <div className="space-y-4 rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
            This is for you if...
          </p>
          <ul className="space-y-2 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
            <li>• You want clarity, not chaos</li>
            <li>• You value guidance over opinions</li>
            <li>• You prefer thoughtful decisions</li>
          </ul>
        </div>
        <div className="space-y-4 rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
            This may not be for you if...
          </p>
          <ul className="space-y-2 text-base text-[var(--tmbc-charcoal)] text-opacity-75">
            <li>• You want flash sales and trend lists</li>
            <li>• You&apos;re looking for a quick checklist only</li>
          </ul>
        </div>
      </section>

      <section className="space-y-5 rounded-[48px] border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 p-10 text-center shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Invite-only</p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
          Taylor-Made Baby Co. is invite-only so we can keep guidance personal and intentional.
        </h2>
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
          We keep it small so the care stays real.
        </p>
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
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
  );
}

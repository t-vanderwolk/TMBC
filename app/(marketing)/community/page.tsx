import Link from "next/link";
import Button from "@/components/ui/Button";
import { MarketingHeading } from "@/components/marketing/Typography";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

const communityModes = [
  {
    title: "Small mentor circles",
    body: "Curated groups with mentors who note your story, calendar, and vibe.",
  },
  {
    title: "Module-linked threads",
    body: "Each academy lesson spawns a thoughtful thread with mentor reflections.",
  },
  {
    title: "Weekly community calls",
    body: "Late-night living room chats that feel like your closest friend.",
  },
  {
    title: "Guest experts & workshops",
    body: "Stylists, doulas, and birth nerds drop into salons with actionable elegance.",
  },
];

const trustSignals = [
  "Mentors complete the Taylor-Made Baby Academy certification.",
  "No judgment. No mom wars. No sponsored overwhelm.",
  "Every member is curated, invite-only, and paired with soft accountability.",
];

export default function CommunityPage() {
  return (
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="marketing-section">
        <div className="marketing-card marketing-card-padding mx-auto max-w-4xl space-y-6 text-[var(--tmbc-charcoal)]">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Community</p>
          <MarketingHeading level="h1" className="mt-3">
            You don't have to Google this alone.
          </MarketingHeading>
          <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            We built a village that feels like a salon, not a feed. Invite-only rooms, lovely accents, and mentors who show up with real answers.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 text-[0.65rem] uppercase tracking-[0.35em]">
            <Button href="/request-invite" variant="secondary">
              Request an Invite
            </Button>
            <Link href="/experience" className="mkt-btn-secondary">
              Explore Experience
            </Link>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-card marketing-card-padding mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Community modes</p>
            <MarketingHeading level="h2" className="text-[var(--tmbc-charcoal)]">
              Modes that keep the village human
            </MarketingHeading>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {communityModes.map((mode) => (
              <div
                key={mode.title}
                className="marketing-panel marketing-card-padding text-left space-y-4"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-50">{mode.title}</p>
                <p className="font-semibold text-base text-[var(--tmbc-charcoal)]">{mode.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-card marketing-card-padding mx-auto max-w-6xl space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="marketing-panel marketing-card-padding text-left space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">Member</p>
              <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
                Member: "Do I really need a wipe warmer?"
              </p>
              <p className="text-[0.7rem] text-[var(--tmbc-charcoal)] text-opacity-60">(She opened the thread at 2:07 a.m.)</p>
            </div>
            <div className="marketing-panel marketing-card-padding text-left space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">Mentor</p>
              <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
                Mentor: "Short answer: no. Longer answer: here's a case where it makes sense—and a few options in case you change your mind."
              </p>
            </div>
            <div className="marketing-panel marketing-card-padding text-left space-y-3">
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">Poll + reflection</p>
              <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">Poll: "Which post-trimester ritual helps you breathe?"</p>
              <p className="text-[0.7rem] text-[var(--tmbc-charcoal)] text-opacity-60">Reflection: Journal snippet pops up beside the threads.</p>
            </div>
          </div>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            The visual language is softness and warmth: little chat tiles, moodboard glimpses, and poll chips that feel like sticky notes from a friend.
          </p>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-proof marketing-card-padding mx-auto max-w-6xl space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Trust signals</p>
            <MarketingHeading level="h2" className="text-[var(--tmbc-charcoal)]">
              A village that keeps the tone calm + honest
            </MarketingHeading>
          </div>
          <ul className="space-y-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            {trustSignals.map((signal) => (
              <li key={signal} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--tmbc-mauve)]" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
            <Link href="/membership" className="mkt-btn-secondary">
              Membership
            </Link>
            <Link href="/request-invite" className="mkt-btn-primary">
              Request an Invite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

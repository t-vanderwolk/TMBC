import Link from "next/link";

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
    <div className="space-y-16">
      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Community</p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--tmbc-charcoal)]">You don't have to Google this alone.</h1>
        <p className="mt-3 text-sm text-[var(--tmbc-charcoal)]/70">
          We built a village that feels like a salon, not a feed. Invite-only rooms, lovely accents, and mentors who show up with real answers.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
          <Link
            href="/request-invite"
            className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-6 py-3 text-[var(--tmbc-charcoal)] font-semibold shadow-[0_15px_45px_rgba(212,181,121,0.35)]"
          >
            Request Invite
          </Link>
          <Link
            href="/experience"
            className="rounded-[32px] border border-[var(--tmbc-charcoal)] px-6 py-3 text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]"
          >
            Explore Experience
          </Link>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_70px_rgba(199,166,199,0.25)]">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Community modes</p>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Modes that keep the village human</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {communityModes.map((mode) => (
            <div
              key={mode.title}
              className="group rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6 text-sm text-[var(--tmbc-charcoal)] shadow-[0_12px_40px_rgba(199,166,199,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[var(--tmbc-mauve)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/50">{mode.title}</p>
              <p className="mt-3 font-semibold text-[var(--tmbc-charcoal)]">{mode.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-8 shadow-[0_20px_70px_rgba(199,166,199,0.25)]">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_15px_45px_rgba(199,166,199,0.15)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Member</p>
            <p className="mt-3 text-sm text-[var(--tmbc-charcoal)]/70">
              Member: "Do I really need a wipe warmer?"
            </p>
            <p className="mt-3 text-[0.7rem] text-[var(--tmbc-charcoal)]/60">(She opened the thread at 2:07 a.m.)</p>
          </div>
          <div className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-gradient-to-br from-[var(--tmbc-blush)]/40 to-white p-6 shadow-[0_15px_45px_rgba(199,166,199,0.15)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Mentor</p>
            <p className="mt-3 text-sm text-[var(--tmbc-charcoal)]/70">
              Mentor: "Short answer: no. Longer answer: here's a case where it makes sense—and a few options in case you change your mind."
            </p>
          </div>
          <div className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-6 shadow-[0_15px_45px_rgba(199,166,199,0.15)]">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Poll + reflection</p>
            <p className="mt-2 text-sm text-[var(--tmbc-charcoal)]/70">Poll: "Which post-trimester ritual helps you breathe?"</p>
            <p className="text-[0.7rem] text-[var(--tmbc-charcoal)]/60">Reflection: Journal snippet pops up beside the threads.</p>
          </div>
        </div>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          The visual language is softness and warmth: little chat tiles, moodboard glimpses, and poll chips that feel like sticky notes from a friend.
        </p>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/40 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Trust signals</p>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">A village that keeps the tone calm + honest</h2>
        </div>
        <ul className="space-y-2 text-sm text-[var(--tmbc-charcoal)]/70">
          {trustSignals.map((signal) => (
            <li key={signal} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--tmbc-mauve)]" />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
          <Link
            href="/membership"
            className="rounded-[32px] border border-[var(--tmbc-charcoal)] px-6 py-3 text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]"
          >
            Membership
          </Link>
          <Link
            href="/request-invite"
            className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-6 py-3 text-[var(--tmbc-charcoal)] font-semibold"
          >
            Request Invite
          </Link>
        </div>
      </section>
    </div>
  );
}

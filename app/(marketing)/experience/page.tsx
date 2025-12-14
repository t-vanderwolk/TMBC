import Link from "next/link";

const feelings = [
  {
    title: "Held",
    copy: "A mentor note that says, 'You're allowed to not have the nursery done yet.'",
  },
  {
    title: "Informed",
    copy: "Registry cards and academy lessons arrive with context, tone, and a soft wink.",
  },
  {
    title: "Ahead of the calendar",
    copy: "We nudge you before a due date panic—then let you breathe again.",
  },
  {
    title: "Less alone",
    copy: "Mini salons and chat threads that feel like late-night texts from a trusted friend.",
  },
];

export default function ExperiencePage() {
  return (
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_25px_90px_rgba(199,166,199,0.3)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Meet Alex & Jordan</p>
        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
              A minimalist duo who wanted calm, not chaos.
            </h1>
            <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
              Alex & Jordan entered TMBC with a cluttered browser, three spreadsheets, and a craving for a baby prep soundtrack
              that felt like their playlist. We leaned in, learned their style, and guided them through nursery, gear, and
              postpartum with cinematic pacing.
            </p>
            <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
              Narrative: nursery → gear → postpartum. We layered mentors, stylists, and community check-ins so each chapter
              felt intentional and gentle.
            </p>
          </div>
          <div className="space-y-4 rounded-[32px] border border-[var(--tmbc-blush)] bg-gradient-to-br from-[var(--tmbc-blush)]/40 to-white p-6 shadow-[0_20px_60px_rgba(199,166,199,0.25)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">Journey highlights</p>
            <ul className="space-y-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
              <li>Nursery moodboard curated with mulberry, ivory, and soft gold accents.</li>
              <li>Gear edits delivered via concierge calls + registry cards.</li>
              <li>Postpartum timeline mapped with mentor check-ins and salon invites.</li>
            </ul>
            <p className="text-[0.8rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-50">Every step: warm, witty, wise.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_70px_rgba(199,166,199,0.25)] marketing-section">
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">Before / After strip</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-4 rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-mauve)]/5 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">Before</p>
            <div className="space-y-2 rounded-[24px] border border-[var(--tmbc-charcoal)]/10 bg-black/5 p-4 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-50">
              <p>47 tabs</p>
              <p>Giant multi-column list</p>
              <p>Doom-scrolling reviews</p>
            </div>
            <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">Overwhelm in gradient form, no one to pause and translate.</p>
          </div>
          <div className="space-y-4 rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-white to-[var(--tmbc-blush)]/50 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">After</p>
            <div className="space-y-4 rounded-[24px] bg-white/80 p-4 shadow-[0_15px_40px_rgba(199,166,199,0.2)]">
              <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                <span>Registry</span>
                <span>Mentor note</span>
              </div>
              <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">Calm capsule edit · 12 pieces · neutral palette</p>
              <p className="text-xs text-[var(--tmbc-charcoal)] text-opacity-60">Mentor: "Let's skip 4 wipe warmers unless you love glow."</p>
            </div>
            <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">Curated registry grid with mentor notes and confident clarity.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/40 p-8 shadow-[0_25px_70px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">What you'll actually feel</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">Emotions with receipts</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {feelings.map((feeling) => (
            <div
              key={feeling.title}
              className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-4 text-base text-[var(--tmbc-charcoal)] shadow-[0_12px_35px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-50">{feeling.title}</p>
              <p className="mt-2 text-base">{feeling.copy}</p>
            </div>
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          You'll still have questions. The difference is you'll know where to ask them.
        </p>
      </section>

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 text-center shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Next chapter</p>
        <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Join a concierge experience that feels editorial.</h2>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Membership is invite-only, with mentors who read your moodboards, registry, and chats in one calm feed.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 text-[0.75rem] uppercase tracking-[0.35em]">
          <Link
            href="/membership"
            className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
          >
            View Membership
          </Link>
          <Link
            href="/request-invite"
            className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
          >
            Request Invite
          </Link>
        </div>
      </section>
    </div>
  );
}

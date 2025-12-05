import Link from "next/link";

const membershipPerks = [
  {
    title: "Academy access",
    description:
      "Curated modules that pair style, research, and mentor annotations. Think modern salon notes, not spreadsheet blurbs.",
  },
  {
    title: "Dynamic registry builder",
    description:
      "Registry grows beside the learning so your essentials, textiles, and heirloom cues feel intentional and editable.",
  },
  {
    title: "Mentor messaging",
    description:
      "Ping mentors, drop voice notes, and get handwritten-feeling edits without the noise.",
  },
  {
    title: "Community & events",
    description:
      "Weekly salons, small circles, and guest experts that keep you feeling held and ahead of the calendar.",
  },
  {
    title: "Affiliate perks library",
    description:
      "We quietly share partner edits with gifts, interiors, and postpartum resources that earn you perks, not pressure.",
  },
];

const faqs = [
  {
    question: "Do I have to buy everything through your links?",
    answer:
      "Nope. We share curated options, but you can shop anywhere. We just keep the concierge notes organized for you.",
  },
  {
    question: "Can my partner or co-parent join too?",
    answer:
      "Yes, they can join the community, the mentor chats, and the registry. Invite them in the intake form.",
  },
  {
    question: "What if I already have a registry elsewhere?",
    answer:
      "We mirror what you already love, then layer in curator edits, smart swaps, and gentle reminders. No duplicate spreadsheets, just one calm dashboard.",
  },
];

export default function MembershipPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_25px_90px_rgba(199,166,199,0.25)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Membership</p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--tmbc-charcoal)]">An invite-only membership for parents who want less noise, more clarity.</h1>
        <p className="mt-4 text-sm text-[var(--tmbc-charcoal)]/70">
          Boutique care, curated mentors, and a registry concierge keep your path Editorial. Learn · Plan · Connect with a village that keeps the tone warm, witty, and real.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
          <Link
            href="/request-invite"
            className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-6 py-3 text-[var(--tmbc-charcoal)] font-semibold shadow-[0_15px_45px_rgba(212,181,121,0.35)]"
          >
            Request Invite
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-[32px] border border-[var(--tmbc-charcoal)] px-6 py-3 text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]"
          >
            How It Works
          </Link>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">What you get</p>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Checklist with concierge glow</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {membershipPerks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/50">{perk.title}</p>
              <p className="mt-3 text-sm text-[var(--tmbc-charcoal)]/70">{perk.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)]">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Pricing & beta</p>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">During beta: membership fee waived.</h2>
        </div>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          Invites are limited because mentors and capacity matter. We intro each member with gentle intention, so we can keep the experience intimate.
        </p>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          Future membership will be a one-time $500 lifetime access. For now, we're keeping the gates steady and the vibe calm.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
          <Link
            href="/request-invite"
            className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-6 py-3 text-[var(--tmbc-charcoal)] font-semibold"
          >
            Request Invite
          </Link>
          <span className="text-[var(--tmbc-charcoal)]/60">
            Takes 2 minutes · We'll tell you if we're not the right fit.
          </span>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">FAQ</p>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">We keep answers honest.</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6">
              <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">{faq.question}</p>
              <p className="mt-2 text-sm text-[var(--tmbc-charcoal)]/70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

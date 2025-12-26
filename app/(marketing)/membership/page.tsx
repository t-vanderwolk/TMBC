import Link from "next/link";

const membershipPerks = [
  {
    title: "Mentor-led planning",
    description:
      "Real humans guide the plan, explain the why, and help you sort what matters now.",
  },
  {
    title: "Shared decision map",
    description:
      "A calm space to organize priorities and decisions without pressure to move fast.",
  },
  {
    title: "Mentor messaging",
    description:
      "Ask questions, share context, and get thoughtful replies without the noise.",
  },
  {
    title: "Community & circles",
    description:
      "Small groups, mentor check-ins, and honest conversations that feel human.",
  },
  {
    title: "Advocacy over sales",
    description:
      "We help you decide what fits your life, and we're fine saying \"skip it.\"",
  },
];

const faqs = [
  {
    question: "Do I have to buy anything through TMBC?",
    answer:
      "No. We don't sell products. Mentors help you weigh options, and you decide what's right.",
  },
  {
    question: "Can my partner or co-parent join too?",
    answer:
      "Yes, they can join the community, the mentor chats, and the registry. Invite them in the intake form.",
  },
  {
    question: "What if I already have a registry elsewhere?",
    answer:
      "We can work with what you already have and help you sort what stays, what waits, and what can go.",
  },
];

export default function MembershipPage() {
  return (
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Membership</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
          An invite-only membership for parents who want human guidance, not noise.
        </h1>
        <p className="mt-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Mentors, steady planning, and a calm community keep your path clear. Learn · Plan · Connect with people who keep the tone warm, witty, and real.
        </p>
        <div className="mt-6 flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request Invite
          </Link>
          <Link href="/how-it-works" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
            How It Works
          </Link>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">What you get</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">A calm plan, shaped together</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {membershipPerks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">{perk.title}</p>
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{perk.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-gradient-to-br from-[var(--tmbc-ivory)] to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Pricing & beta</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">During beta: membership fee waived.</h2>
        </div>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Invites are limited because mentors and capacity matter. We welcome each member with care, so the support stays personal.
        </p>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Future membership will be a one-time $500 lifetime access. For now, we're keeping the gates steady and the pace calm.
        </p>
        <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:items-center sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request Invite
          </Link>
          <span className="text-[var(--tmbc-charcoal)] text-opacity-60">
            Takes 2 minutes · We'll tell you if we're not the right fit.
          </span>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">FAQ</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">We keep answers honest.</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6">
              <p className="text-base font-semibold text-[var(--tmbc-charcoal)]">{faq.question}</p>
              <p className="mt-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

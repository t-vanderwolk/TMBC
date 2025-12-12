"use client";

type MemberWelcomeHeaderProps = {
  userName?: string | null;
  tone?: string;
  intention?: string;
  highlight?: string;
};

export default function MemberWelcomeHeader({
  userName,
  tone,
  intention,
  highlight,
}: MemberWelcomeHeaderProps) {
  const safeName = userName?.trim() || "Friend";
  const toneLine =
    tone ?? "A calm check-in, speaking softly to whatever feels tender today.";
  const intentionLine =
    intention ?? "We're honoring the pace you set, not a checklist.";
  const highlightMessage = highlight ?? "Taylor-Made Baby Co. is holding space for your bloom.";

  return (
    <section className="rounded-[2.8rem] border border-[#F3DDE4] bg-gradient-to-br from-[#FFF8F6] via-[#FCEAF0] to-[#F6E0E6] px-8 py-10 shadow-[0_30px_70px_rgba(199,166,179,0.25)]">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
        Daily check-in
      </p>
      <h1 className="mt-3 text-4xl font-serif text-[#3E2F35]">
        Good morning, {safeName}.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[#3E2F35]/70 leading-relaxed">
        {toneLine} {intentionLine}
      </p>
      <div className="mt-6 rounded-[2rem] bg-[#fffaf7]/80 px-6 py-4 text-[#3E2F35] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Studio mantra</p>
        <p className="mt-2 text-lg font-semibold">{highlightMessage}</p>
      </div>
    </section>
  );
}

"use client";

type DashboardHeroProps = {
  name: string;
};

export default function DashboardHero({ name }: DashboardHeroProps) {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const affirmations = [
    "You’re preparing with so much love — it shows.",
    "Small steps count. You’re right on time.",
    "A calm plan is the best plan.",
    "You’re doing beautifully — truly.",
  ];

  const phrase = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <section className="rounded-[2.5rem] bg-gradient-to-br from-[#FFF8F6] to-[#F2D8DF]/60 p-8 shadow-[0_20px_45px_rgba(200,161,180,0.18)] border border-[#EAD4D8]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4] font-semibold">
        {greeting}, {name}
      </p>
      <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">
        Your calm prep command center
      </h1>
      <p className="mt-2 text-sm text-[#3E2F35]/70">{phrase}</p>
    </section>
  );
}

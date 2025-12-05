"use client";

export type MentorOverviewPayload = {
  mentees: number;
  journalsAwaiting: number;
  pendingTasks: number;
};

type MentorHeroProps = {
  name: string;
  overview: MentorOverviewPayload;
};

export default function MentorHero({ name, overview }: MentorHeroProps) {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const cards = [
    { label: "Active Mentees", value: overview.mentees },
    { label: "Journals Awaiting", value: overview.journalsAwaiting },
    { label: "Pending Tasks", value: overview.pendingTasks },
  ];

  return (
    <section className="mentor-hero-card">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
          {greeting}, {name}
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">
          Your concierge command center
        </h1>
        <p className="mt-1 text-sm text-[#3E2F35]/70">
          See who needs a note, which circles open, and how your mentees are progressing.
        </p>
      </div>

      <div className="mentor-hero-card__stats">
        {cards.map((card) => (
          <div key={card.label} className="mentor-hero-card__stat">
            <span className="text-sm text-[#C8A1B4] tracking-[0.3em] uppercase">
              {card.label}
            </span>
            <strong className="text-2xl text-[#3E2F35]">{card.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

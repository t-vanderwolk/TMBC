import { Compass, HeartHandshake, Sprout, NotebookPen } from 'lucide-react';

const phases = [
  {
    title: 'Learn',
    description:
      'Start with curated mini-guides that prioritize evidence-based education and soulful storytelling.',
    icon: NotebookPen,
  },
  {
    title: 'Plan',
    description:
      'Co-create your personalized registry, nursery checklist, and postpartum plan with our concierge team.',
    icon: Compass,
  },
  {
    title: 'Connect',
    description: 'Meet mentors who have been exactly where you are and join intimate community circles.',
    icon: HeartHandshake,
  },
  {
    title: 'Grow',
    description: 'Keep evolving with weekly prompts, flexible coaching, and perks that support every milestone.',
    icon: Sprout,
  },
];

const HowItWorksPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">The TMBC Flow</p>
        <h1 className="font-serif text-4xl">Learn → Plan → Connect → Grow</h1>
        <p className="text-tmCharcoal/80">
          Every family is different, but clarity, mentorship, and a warm community are universal.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {phases.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-tmMauve/30 bg-white/80 p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-tmBlush/60 p-3 text-tmMauve">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl">{title}</h2>
            </div>
            <p className="mt-4 text-sm text-tmCharcoal/80">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksPage;

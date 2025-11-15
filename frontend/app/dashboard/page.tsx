import Link from 'next/link';

const dashboards = [
  { title: 'Academy', description: 'Guided lessons and expert office hours.', href: '/dashboard/academy' },
  { title: 'Registry', description: 'Shop the curated list and concierge recommendations.', href: '/dashboard/registry' },
  { title: 'Community', description: 'Join conversations, weekly Zoom, and mentor chats.', href: '/dashboard/community' },
];

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Dashboard</p>
        <h1 className="font-serif text-4xl">Welcome to your Taylor-Made Dashboard</h1>
        <p className="text-sm text-tmCharcoal/80">Choose where to begin below. Modules will unlock throughout beta.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {dashboards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-3xl border border-tmMauve/30 bg-white/80 p-6 shadow-soft transition hover:-translate-y-1"
          >
            <h2 className="font-serif text-2xl">{card.title}</h2>
            <p className="mt-2 text-sm text-tmCharcoal/80">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

const MembershipPage = () => {
  const perks = [
    'Invite-only mentorship onboarding tailored to your trimester.',
    '$500 founding membership after beta (includes concierge kick-off).',
    'Mentor-to-member accountability model with curated matches.',
    'Weekly community Zoom for live coaching and real talk.',
    'Affiliate Perks of the Week featuring registry exclusives.',
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Membership</p>
        <h1 className="font-serif text-4xl">Made for Modern, Intentional Parents</h1>
        <p className="text-tmCharcoal/80">
          TMBC keeps capacity top of mind with white-glove support, curated resources, and a values-driven community.
        </p>
      </header>
      <section className="rounded-3xl border border-tmMauve/30 bg-white/80 p-8 shadow-soft">
        <h2 className="font-serif text-2xl">What&apos;s included</h2>
        <ul className="mt-6 space-y-4 text-sm text-tmCharcoal/80">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-tmMauve" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MembershipPage;

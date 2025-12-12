"use client";

const FEED = [
  {
    id: "studio-rhythm",
    title: "Studio Rhythm · Weekly Check-in",
    date: "Today · 10:00 AM",
    summary: "Your mentor dropped a quick ritual to ground your weekend. Tap in, breathe, and respond when you’re ready.",
    link: "/dashboard/community",
  },
  {
    id: "registry-pulse",
    title: "Registry Pulse · Curated Edit",
    date: "Yesterday",
    summary: "New carbon-neutral swaddles just landed in the registry. Mark essentials and share the set with your concierge.",
    link: "/dashboard/registry",
  },
  {
    id: "events-update",
    title: "Events · Fireside Circle",
    date: "This Week",
    summary: "Join the mentor-hosted fireside to hear three TMBC families share their birth stories and keepsakes.",
    link: "/dashboard/events",
  },
];

export default function NewsFeed() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Studio News</p>
        <a className="text-xs uppercase tracking-[0.35em] text-[#B98AA5] hover:text-[#C8A1B4]" href="/dashboard/events">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {FEED.map((post) => (
          <article
            key={post.id}
            className="rounded-[26px] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_20px_60px_rgba(180,143,164,0.2)] transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
              <span>{post.title}</span>
              <span>{post.date}</span>
            </div>
            <p className="mt-2 text-sm text-[#3E2F35]/70">{post.summary}</p>
            <a
              href={post.link}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:text-[#B98AA5]"
            >
              Open →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

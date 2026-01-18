type CircleFeedItem = {
  id: string;
  title: string;
  body: string;
  timestamp?: string | null;
  source?: string;
};

type CircleFeedProps = {
  items: CircleFeedItem[];
};

const formatTimestamp = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const MAX_FEED_ITEMS = 5;
const FEED_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='rgba(255,255,255,0.85)'/%3E%3Cpath d='M0 20h80M0 40h80M0 60h80M20 0v80M40 0v80M60 0v80' stroke='rgba(255,255,255,0.35)' stroke-width='0.5'/%3E%3C/svg%3E\")";

export default function CircleFeed({ items }: CircleFeedProps) {
  const compactItems = items.slice(0, MAX_FEED_ITEMS);

  return (
    <section
      className="rounded-[34px] border border-member-border-default/60 bg-member-background-card p-7 shadow-soft"
      style={{ backgroundImage: FEED_TEXTURE }}
    >
      <div className="border-l-4 border-member-accent-secondary pl-4 space-y-1">
        <p className="text-xs uppercase tracking-[0.35em] text-member-accent-secondary">From Your Circle</p>
        <h2 className="font-serif text-3xl text-member-text-primary">Circle feed</h2>
        <p className="text-sm text-member-text-secondary">
          Mentors, modules, and steady context tailored to you.
        </p>
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-member-text-secondary">
          You were here recently
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {compactItems.length === 0 ? (
          <p className="rounded-2xl border border-member-border-soft bg-member-background-soft px-4 py-6 text-sm text-member-text-secondary/80">
            Nothing new here — which usually means you’re right where you need to be.
          </p>
        ) : (
          compactItems.map((item, index) => (
            <article
              key={item.id}
              className={`grid gap-3 rounded-[30px] border border-member-border-soft p-4 shadow-[0_12px_28px_rgba(62,47,53,0.08)] transition duration-300 ${
                index % 2 === 0 ? "min-h-[110px] bg-member-background-soft" : "min-h-[96px] bg-member-background-card"
              } hover:-translate-y-[2px]`}
            >
              <header className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-member-text-secondary">
                <span>{item.source ?? "Circle"}</span>
                {item.timestamp ? (
                  <time dateTime={item.timestamp}>{formatTimestamp(item.timestamp)}</time>
                ) : null}
              </header>
              <h3 className="font-serif text-lg text-member-text-primary">{item.title}</h3>
              <p className="text-sm text-member-text-secondary leading-relaxed">{item.body}</p>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-member-text-secondary">
                Gentle signal
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

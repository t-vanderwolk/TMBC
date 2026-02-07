// JournalSpotlight guardrails:
// - This section intentionally references a curated evergreen post
// - Headline copy should stay intentional and unchanged
import Link from "next/link";

export function JournalSpotlight() {
  return (
    <article className="marketing-card marketing-card-padding rounded-2xl border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/90 space-y-4">
      <div className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
        FROM OUR JOURNAL · JOURNAL / BLOG
      </div>
      <h3 className="font-serif text-[34px] leading-[1.1] text-[var(--tmbc-charcoal)]">
        The Art of the Registry
      </h3>
      <div className="space-y-2 text-[16px] leading-relaxed text-muted-foreground max-w-[40ch]">
        <p>A calm, optional exploration of how intentional baby prep actually unfolds.</p>
        <p>What different gear really does, how to decide what matters, and how to prepare without losing yourself.</p>
        <p>Pull up a journal-style note for a mentor-led perspective, no pressure.</p>
      </div>
      <Link
        href="/blog/the-art-of-the-registry"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--tmbc-charcoal)]/20 px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-charcoal)]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tmbc-charcoal)] focus-visible:outline-offset-4"
      >
        <span>Read full article</span>
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}

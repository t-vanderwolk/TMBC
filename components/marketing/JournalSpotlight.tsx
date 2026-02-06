// JournalSpotlight guardrails:
// - This section intentionally references a curated evergreen post
// - Headline copy should stay intentional and unchanged
import Link from "next/link";

export function JournalSpotlight() {
  return (
    <div className="space-y-6 text-left">
      <div className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
        FROM OUR JOURNAL
      </div>
      <h3 className="font-serif text-[34px] leading-[1.1] text-[var(--tmbc-charcoal)]">
        The Art of the Registry
      </h3>
      <div className="space-y-2 text-[16px] leading-relaxed text-muted-foreground">
        <p>A closer look at how calm, intentional baby prep actually unfolds.</p>
        <p>What different gear really does.</p>
        <p>How to decide what matters.</p>
        <p>And how to prepare without overbuying or losing yourself in the process.</p>
      </div>
      <Link
        href="/blog/the-art-of-the-registry"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--tmbc-blush-soft)]/60 px-6 py-3 text-[13px] uppercase tracking-widest text-[var(--tmbc-charcoal)] transition hover:bg-[var(--tmbc-blush-soft)]/80"
      >
        <span>Read full article</span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

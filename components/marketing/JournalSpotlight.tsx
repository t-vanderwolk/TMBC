// JournalSpotlight guardrails:
// - This section intentionally references a curated evergreen post
// - Headline copy should stay intentional and unchanged
import Link from "next/link";

export function JournalSpotlight() {
  return (
    <section className="journal-spotlight">
      <p className="journal-eyebrow">From Our Journal</p>
      <h3 className="journal-title">The Art of the Registry</h3>
      <div className="journal-excerpt">
        <p>A calm, optional exploration of how intentional baby prep actually unfolds.</p>
        <p>What different gear really does, how to decide what matters, and how to prepare without losing yourself.</p>
        <p>A journal-style note, written from a mentor’s perspective — no pressure, no urgency.</p>
      </div>
      <Link href="/journal/the-art-of-the-registry" className="journal-link">
        Read the full note →
      </Link>
    </section>
  );
}

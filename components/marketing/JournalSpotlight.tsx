// JournalSpotlight guardrails:
// - This section intentionally references a curated evergreen post
// - Headline copy should stay intentional and unchanged
import Link from "next/link";

export function JournalSpotlight() {
  return (
    <section className="bg-[#faf2f5] py-24 md:py-32">
      <div className="mx-auto max-w-[680px] px-6 md:px-0 text-left space-y-6">
        <div className="mb-6 text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
          From the journal
        </div>
        <h2 className="font-serif text-[34px] leading-tight text-foreground md:text-[40px] mb-4">
          The Art of the Registry
        </h2>
        <p className="text-[16px] md:text-[17px] leading-relaxed text-muted-foreground max-w-[60ch] mb-10">
          How to prepare for baby without overbuying — and without
          losing yourself in the process.
        </p>
        <Link
          href="/blog/the-art-of-the-registry"
          className="inline-flex items-center gap-2 text-[13px] uppercase tracking-widest text-foreground hover:opacity-70 transition"
        >
          <span>Read the journal</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

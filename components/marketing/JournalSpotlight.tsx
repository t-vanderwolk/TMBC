// JournalSpotlight guardrails:
// - This section intentionally features a curated evergreen post
// - Do NOT auto-swap to latest content
// - Homepage spotlight is editorial, not chronological

import Link from "next/link";

export function JournalSpotlight() {
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-white">
      <div className="mx-auto max-w-3xl px-6 md:px-10 text-left">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          From the Journal
        </p>

        <h2 className="text-3xl md:text-4xl leading-tight">
          The Art of the Registry
        </h2>

        <p className="mt-3 text-lg text-muted-foreground max-w-[46ch]">
          How to prepare for baby without overbuying — or losing your mind in aisle seven.
        </p>

        <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-[52ch]">
          There’s a quiet skill to preparing for a baby that no one really teaches you.
          Knowing what you actually need. What can wait. And what looks helpful but never leaves the box.
        </p>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-[52ch]">
          Inside our Journal, we walk through the art of building a registry with intention —
          learning what products do, planning alongside a trusted mentor, connecting with other parents
          asking the same questions, and reflecting as you go so the whole experience becomes something
          worth keeping.
        </p>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-[52ch]">
          This is baby prep without the panic scrolling. And without buying everything.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/blog/the-art-of-the-registry"
            className="inline-flex w-fit items-center justify-center rounded-full bg-mauve px-6 py-3 text-white transition hover:opacity-90"
          >
            Read the journal
          </Link>

          <Link
            href="/experience"
            className="inline-flex w-fit items-center text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            Explore the Taylor-Made experience →
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground italic">
          Written by mentors who’ve been exactly where you are.
        </p>
      </div>
    </section>
  );
}

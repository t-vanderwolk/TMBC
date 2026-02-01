"use client";

// TODO: Replace these placeholders with upload widgets that keep image references private.
export default function MemoriesSection() {
  const MEMORY_CARDS = [
    { title: "Screenshot uploads", description: "Capture a quiet text or note you want to hold." },
    { title: "Photos", description: "Drop the soft lighting or small hands you want to remember." },
    { title: "Short notes", description: "Jot the tiny stories that might fade soon." },
  ];

  return (
    <section className="space-y-4 rounded-[1.5rem] border border-[#F1D5DA] bg-white/90 p-5">
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Memories</p>
        <h2 className="text-xl font-semibold text-[#3E2F35]">Moments you don’t want to forget — even if they feel small now.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {MEMORY_CARDS.map((card) => (
          <div
            key={card.title}
            className="space-y-2 rounded-[1rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 p-4 text-sm text-[#3E2F35]/70"
          >
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[#A4556A]">{card.title}</p>
            <p>{card.description}</p>
            <div className="rounded-[0.75rem] border border-dashed border-[#A4556A] px-3 py-2 text-xs text-[#A4556A]">
              placeholder
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

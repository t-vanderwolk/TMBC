"use client";

const SIDEBAR_ITEMS = [
  "Welcome",
  "Baby Details",
  "Memories",
  "Reflections",
  "Voice Notes",
  "Vault",
];

export default function ReflectSidebar() {
  // TODO: Make sidebar links scroll to sections once scrolling and focus states are defined.
  return (
    <aside className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Explore</p>
      <div className="space-y-2">
        {SIDEBAR_ITEMS.map((item) => (
          <div
            key={item}
            className="rounded-[1.5rem] border border-transparent bg-[#FFFAF8]/80 px-4 py-3 text-sm text-[#3E2F35]/70 transition hover:border-[#C8A1B4]"
          >
            <p className="font-semibold text-[#3E2F35]">{item}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#A4556A]">Quiet presence</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

const checklistCategories = [
  "Nursery setup cues",
  "Gear & essentials",
  "Wellness appointments",
  "Sibling prep",
];

export default function ReferenceChecklistPanel() {
  return (
    <section className="space-y-4 rounded-[28px] border border-[#EAE2E8] bg-white/90 p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">
          Everything you need
        </p>
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Static view</span>
      </header>
      <div className="space-y-2">
        {checklistCategories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between rounded-[16px] border border-[#EAE2E8] bg-[#FFF9F5] px-4 py-3 text-sm text-[#3E2F35]/80"
          >
            <span>{category}</span>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Status placeholder</span>
          </div>
        ))}
      </div>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
        This checklist will reflect your curated categories once the reference structure lands.
      </p>
    </section>
  );
}

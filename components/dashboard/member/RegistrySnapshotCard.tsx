"use client";

type RegistryItem = {
  name?: string | null;
  status?: string | null;
  detail?: string | null;
};

type RegistrySnapshotCardProps = {
  items?: RegistryItem[] | null;
  curatedCount?: number | null;
  nextReview?: string | null;
};

export default function RegistrySnapshotCard({
  items,
  curatedCount,
  nextReview,
}: RegistrySnapshotCardProps) {
  const safeItems = items?.length
    ? items
    : [
        { name: "Curated nightsweater", status: "Pending mentor notes" },
        { name: "Heirloom bib", status: "Saved", detail: "Sharing for review" },
      ];
  const safeCount = curatedCount ?? safeItems.length;
  const safeReview = nextReview ?? "Mentor review · Coming soon";

  return (
    <section className="rounded-[2.5rem] border border-[#E1D1D6] bg-white/90 p-6 shadow-[0_25px_60px_rgba(200,161,180,0.12)]">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
        Registry snapshot
      </p>
      <h2 className="mt-3 text-3xl font-serif text-[#3E2F35]">Calm curation</h2>
      <p className="mt-2 text-sm text-[#3E2F35]/70">
        {safeCount} pieces currently aligned with your mentor.
      </p>
      <div className="mt-5 space-y-3">
        {safeItems.map((item, index) => (
          <div
            key={`registry-item-${item.name ?? index}`}
            className="rounded-2xl bg-[#FEF8F5]/80 px-4 py-3 text-sm text-[#3E2F35]/80"
          >
            <p className="text-base font-semibold text-[#3E2F35]">
              {item.name ?? "Curated item"}
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]/90">
              {item.status ?? "Status pending"}
            </p>
            {item.detail && (
              <p className="mt-1 text-[0.75rem] text-[#3E2F35]/60">{item.detail}</p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/50">
        {safeReview}
      </p>
    </section>
  );
}

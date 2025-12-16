export default function AdminInsights() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <InsightCard title="Active Members" value="128" />
      <InsightCard title="Pending Invites" value="42" />
      <InsightCard title="Events This Week" value="6" />
    </div>
  );
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E3C6D4] bg-white/90 p-6 shadow-sm">
      <p className="uppercase tracking-[0.35em] text-xs text-[#C8A1B4]">{title}</p>
      <p className="mt-3 font-serif text-3xl text-[#3E2F35] md:text-4xl">{value}</p>
    </div>
  );
}

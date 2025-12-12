export default function AdminInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <InsightCard title="Active Members" value="128" />
      <InsightCard title="Pending Invites" value="42" />
      <InsightCard title="Events This Week" value="6" />
    </div>
  );
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[2rem] bg-white/90 border border-[#E3C6D4] p-6 shadow-[0_18px_50px_rgba(180,143,164,0.15)]">
      <p className="uppercase tracking-[0.35em] text-xs text-[#C8A1B4]">{title}</p>
      <p className="mt-3 font-serif text-4xl text-[#3E2F35]">{value}</p>
    </div>
  );
}

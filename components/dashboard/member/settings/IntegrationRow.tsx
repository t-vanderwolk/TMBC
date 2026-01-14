type IntegrationRowProps = {
  name: string;
  status: string;
  note: string;
};

export default function IntegrationRow({ name, status, note }: IntegrationRowProps) {
  return (
    <article className="rounded-[26px] border border-[#E3C6D4] bg-white/90 px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#3E2F35]">{name}</p>
        <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">{status}</span>
      </div>
      <p className="mt-2 text-sm text-[#3E2F35]/70 leading-relaxed">{note}</p>
    </article>
  );
}

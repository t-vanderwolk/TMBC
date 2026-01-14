type StatusCardProps = {
  title: string;
  status: string;
  note: string;
};

export default function StatusCard({ title, status, note }: StatusCardProps) {
  return (
    <section className="rounded-[32px] border border-[#E3D0D7] bg-[#FFF9F5]/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">{title}</p>
        <span className="rounded-full border border-[#E3C6D4] px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">
          {status}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#3E2F35]/70 leading-relaxed">{note}</p>
    </section>
  );
}

type MyRegistryPlaceholderProps = {
  title: string;
  description: string;
  status?: "coming-soon" | string;
  note?: string;
};

const formatStatus = (status?: string) => {
  if (!status) return "Coming soon";
  if (status.toLowerCase().includes("coming")) return status;
  return status
    .split(/[-\s]+/)
    .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
    .join(" ");
};

export default function MyRegistryPlaceholder({
  title,
  description,
  status,
  note,
}: MyRegistryPlaceholderProps) {
  return (
    <section className="rounded-[28px] border border-[#E3C6D4] bg-[#FFFDFB] p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">{title}</p>
        </div>
        {status ? (
          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-[#C8A1B4]">
            {formatStatus(status)}
          </span>
        ) : (
          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-[#C8A1B4]">
            Coming soon
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-[#3E2F35]/70 leading-relaxed">{description}</p>
      {note ? (
        <p className="mt-3 text-[0.7rem] uppercase tracking-[0.35em] text-[#A4556A] text-opacity-80">
          {note}
        </p>
      ) : null}
    </section>
  );
}

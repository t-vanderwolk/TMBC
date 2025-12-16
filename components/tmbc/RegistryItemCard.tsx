import StyledButton from "@/components/tmbc/StyledButton";
import MentorNoteDrawer from "@/components/tmbc/MentorNoteDrawer";

export type RegistryItemCardProps = {
  image: string;
  title: string;
  price: string;
  reason: string;
  affiliateUrl?: string;
  notes?: string;
  className?: string;
};

export default function RegistryItemCard({
  image,
  title,
  price,
  reason,
  affiliateUrl,
  notes,
  className = "",
}: RegistryItemCardProps) {
  return (
    <article
      className={`grid gap-4 rounded-2xl border border-[#E3C6D4] bg-white/90 p-4 shadow-sm md:grid-cols-[150px,1fr] ${className}`}
    >
      <div className="h-32 w-full overflow-hidden rounded-2xl bg-[#F8E8EF]">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-[#3E2F35] md:text-xl">{title}</h3>
          <span className="text-sm font-semibold text-[#B98AA5]">{price}</span>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#C7A6C9]">Why you’re seeing this</p>
        <p className="text-sm text-[#3E2F35]/75 md:text-base">{reason}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <StyledButton variant="ghost">Mentor notes</StyledButton>
          {affiliateUrl && (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.4em] text-[#C7A6C9]"
            >
              Add to Registry
            </a>
          )}
        </div>
        {notes && <MentorNoteDrawer notes={notes} />}
      </div>
    </article>
  );
}
